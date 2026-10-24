// Throwaway local stand-in for a Supabase project, to try the website and
// the admin end to end without a live project. Never touches a live project
// and sends no e-mail. See README.md in this folder.
//   Postgres: PGlite + dennis-web migrations   REST: real PostgREST binary
//   Auth: stub signing JWTs for seeded users   Storage: stub enforcing RLS
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import http from "node:http";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, createReadStream, statSync, rmSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.env.REPO ?? join(here, "..", "..");
const runDir = join(here, ".run");
rmSync(runDir, { recursive: true, force: true });
mkdirSync(join(runDir, "storage"), { recursive: true });

const GATEWAY_PORT = 54421, PG_PORT = 54429, REST_PORT = 54430;
const JWT_SECRET = "local-only-test-secret-not-used-anywhere-else-000";
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const sign = (payload) => { const h = b64({ alg: "HS256", typ: "JWT" }); const b = b64(payload); return `${h}.${b}.${crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${b}`).digest("base64url")}`; };
const verify = (token) => { try { const [h, b, s] = token.split("."); if (s !== crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${b}`).digest("base64url")) return null; const p = JSON.parse(Buffer.from(b, "base64url").toString()); return p.exp && p.exp < Date.now() / 1000 ? null : p; } catch { return null; } };
const far = 4102444800;
const ANON_KEY = sign({ iss: "supabase-local", role: "anon", exp: far });
const SERVICE_KEY = sign({ iss: "supabase-local", role: "service_role", exp: far });

const db = new PGlite();
await db.exec(readFileSync(join(repo, "tests", "supabase-platform.sql"), "utf8"));
await db.exec(`alter table auth.users add column if not exists encrypted_password text;
  do $$ begin create role authenticator noinherit login password 'local'; exception when duplicate_object then null; end $$;
  grant anon, authenticated, service_role to authenticator;`);
for (const f of readdirSync(join(repo, "supabase", "migrations")).filter((f) => f.endsWith(".sql")).sort()) await db.exec(readFileSync(join(repo, "supabase", "migrations", f), "utf8"));
await db.exec(`
  insert into auth.users (id, email, encrypted_password) values
    ('11111111-1111-4111-8111-111111111111', 'dennis@example.test', 'lokaal-testen-123'),
    ('22222222-2222-4222-8222-222222222222', 'bezoeker@example.test', 'lokaal-testen-123');
  insert into public.admin_users (user_id, display_name) values ('11111111-1111-4111-8111-111111111111', 'Dennis (test)');
  insert into public.reviews (name, email, city, project, rating, text, status, action_token_hash) values
    ('Testklant Sanne', 'sanne@example.test', 'Almere', 'Badkamer', 5, 'Dit is een testreview om de moderatie te proberen.', 'pending', 'local-hash-1');
`);
console.log("database ready");

const pgServer = new PGLiteSocketServer({ db, port: PG_PORT, host: "127.0.0.1", maxConnections: 20 });
await pgServer.start();
const confPath = join(runDir, "postgrest.conf");
writeFileSync(confPath, [`db-uri = "postgres://postgres:postgres@127.0.0.1:${PG_PORT}/postgres?sslmode=disable"`, `db-schemas = "public"`, `db-anon-role = "anon"`, `db-pool = 1`, `db-channel-enabled = false`, `db-prepared-statements = false`, `jwt-secret = "${JWT_SECRET}"`, `server-host = "127.0.0.1"`, `server-port = ${REST_PORT}`, `log-level = "error"`].join("\n"));
if (!process.env.POSTGREST_BIN || !existsSync(process.env.POSTGREST_BIN)) {
  console.error("Set POSTGREST_BIN to the PostgREST executable (https://github.com/PostgREST/postgrest/releases).");
  process.exit(1);
}
const rest = spawn(process.env.POSTGREST_BIN, [confPath], { stdio: ["ignore", "inherit", "inherit"] });
rest.on("exit", (code) => console.error(`PostgREST stopped (${code})`));

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD", "Access-Control-Allow-Headers": "authorization, apikey, content-type, prefer, accept, accept-profile, content-profile, range, x-client-info, x-upsert, cache-control, x-supabase-api-version", "Access-Control-Expose-Headers": "content-range, content-location, location" };
const send = (res, status, body, headers = {}) => { res.writeHead(status, { "Content-Type": "application/json", ...cors, ...headers }); res.end(body === undefined ? "" : JSON.stringify(body)); };
const readBody = (req) => new Promise((resolve) => { const c = []; req.on("data", (x) => c.push(x)); req.on("end", () => resolve(Buffer.concat(c))); });
const bearer = (req) => (req.headers.authorization ?? "").replace(/^Bearer\s+/i, "") || req.headers.apikey || "";
function proxy(req, res, port, path) {
  const headers = { ...req.headers, host: `127.0.0.1:${port}` };
  if (!headers.authorization && headers.apikey) headers.authorization = `Bearer ${headers.apikey}`;
  const up = http.request({ host: "127.0.0.1", port, path, method: req.method, headers }, (u) => { res.writeHead(u.statusCode ?? 502, { ...Object.fromEntries(Object.entries(u.headers).filter(([k]) => !k.startsWith("access-control-"))), ...cors }); u.pipe(res); });
  up.on("error", () => send(res, 502, { message: "upstream not ready" }));
  req.pipe(up);
}

const users = (await db.query("select id, email, encrypted_password, created_at from auth.users")).rows;
const refreshTokens = new Map();
const userJson = (u) => ({ id: u.id, aud: "authenticated", role: "authenticated", email: u.email, email_confirmed_at: u.created_at, app_metadata: { provider: "email", providers: ["email"] }, user_metadata: {}, identities: [], factors: [], created_at: u.created_at, updated_at: u.created_at });
const session = (u) => { const now = Math.floor(Date.now() / 1000); const refresh = crypto.randomBytes(16).toString("hex"); refreshTokens.set(refresh, u.id); return { access_token: sign({ sub: u.id, email: u.email, role: "authenticated", aud: "authenticated", session_id: crypto.randomUUID(), iat: now, exp: now + 3600 }), token_type: "bearer", expires_in: 3600, expires_at: now + 3600, refresh_token: refresh, user: userJson(u) }; };

async function handleAuth(req, res, url) {
  const path = url.pathname.replace("/auth/v1", "");
  if (path === "/token" && req.method === "POST") {
    const body = JSON.parse((await readBody(req)).toString() || "{}");
    const grant = url.searchParams.get("grant_type");
    if (grant === "password") { const u = users.find((x) => x.email === String(body.email ?? "").toLowerCase() && x.encrypted_password === body.password); return u ? send(res, 200, session(u)) : send(res, 400, { error: "invalid_grant", error_description: "Invalid login credentials", code: "invalid_credentials", msg: "Invalid login credentials" }); }
    if (grant === "refresh_token") { const u = users.find((x) => x.id === refreshTokens.get(body.refresh_token)); return u ? send(res, 200, session(u)) : send(res, 400, { error: "invalid_grant" }); }
  }
  if (path === "/user") { const c = verify(bearer(req)); const u = c && users.find((x) => x.id === c.sub); return u ? send(res, 200, userJson(u)) : send(res, 401, { msg: "invalid JWT" }); }
  if (path === "/logout") return send(res, 204);
  if (path === "/recover") return send(res, 200, {});
  return send(res, 404, { msg: `auth stub: ${req.method} ${path}` });
}

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
async function asRole(claims, fn) {
  return db.transaction(async (tx) => {
    await tx.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify(claims)]);
    await tx.exec(`set local role ${claims.role === "service_role" ? "service_role" : claims.role === "authenticated" ? "authenticated" : "anon"}`);
    return fn(tx);
  });
}
async function handleStorage(req, res, url) {
  const parts = url.pathname.replace("/storage/v1/object/", "").split("/").map(decodeURIComponent);
  if (parts[0] === "public" && req.method === "GET") {
    const file = join(runDir, "storage", ...parts.slice(1));
    if (!existsSync(file) || !statSync(file).isFile()) return send(res, 404, { message: "Object not found" });
    res.writeHead(200, { "Content-Type": MIME[extname(file).toLowerCase()] ?? "application/octet-stream", ...cors });
    return createReadStream(file).pipe(res);
  }
  const claims = verify(bearer(req)) ?? { role: "anon" };
  if (req.method === "POST" || req.method === "PUT") {
    const [bucket, ...rest] = parts;
    const body = await readBody(req);
    const b = (await db.query("select file_size_limit, allowed_mime_types from storage.buckets where id = $1", [bucket])).rows[0];
    if (!b) return send(res, 404, { message: "Bucket not found" });
    if (b.allowed_mime_types && !b.allowed_mime_types.includes(req.headers["content-type"])) return send(res, 415, { message: "mime type not supported" });
    if (b.file_size_limit && body.length > Number(b.file_size_limit)) return send(res, 413, { message: "too large" });
    try { await asRole(claims, (tx) => tx.query("insert into storage.objects (bucket_id, name) values ($1, $2)", [bucket, rest.join("/")])); }
    catch (e) { return send(res, 403, { statusCode: "403", message: `new row violates row-level security policy (${e.message})` }); }
    const file = join(runDir, "storage", bucket, ...rest);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, body);
    return send(res, 200, { Key: `${bucket}/${rest.join("/")}` });
  }
  if (req.method === "DELETE") {
    const [bucket] = parts;
    const { prefixes = [] } = JSON.parse((await readBody(req)).toString() || "{}");
    const removed = [];
    for (const name of prefixes) {
      try { const r = await asRole(claims, (tx) => tx.query("delete from storage.objects where bucket_id = $1 and name = $2 returning name", [bucket, name])); if (r.rows.length) { rmSync(join(runDir, "storage", bucket, ...name.split("/")), { force: true }); removed.push({ name }); } } catch { /* refused */ }
    }
    return send(res, 200, removed);
  }
  return send(res, 404, { message: "storage stub: not implemented" });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${GATEWAY_PORT}`);
  if (req.method === "OPTIONS") return send(res, 204, undefined, req.headers["access-control-request-headers"] ? { "Access-Control-Allow-Headers": req.headers["access-control-request-headers"] } : {});
  try {
    if (url.pathname.startsWith("/rest/v1/")) return proxy(req, res, REST_PORT, url.pathname.replace("/rest/v1", "") + url.search);
    if (url.pathname.startsWith("/auth/v1/")) return await handleAuth(req, res, url);
    if (url.pathname.startsWith("/storage/v1/object/")) return await handleStorage(req, res, url);
    return send(res, 404, { message: "not found" });
  } catch (e) { console.error(e); return send(res, 500, { message: String(e) }); }
}).listen(GATEWAY_PORT, () => {
  writeFileSync(join(repo, ".env.localtest"), `VITE_SUPABASE_URL=http://localhost:${GATEWAY_PORT}\nVITE_SUPABASE_ANON_KEY=${ANON_KEY}\nSUPABASE_URL=http://localhost:${GATEWAY_PORT}\nSUPABASE_SERVICE_ROLE_KEY=${SERVICE_KEY}\nPUBLIC_SITE_URL=http://localhost:5391\n`);
  console.log(`gateway ready on http://localhost:${GATEWAY_PORT}`);
});
