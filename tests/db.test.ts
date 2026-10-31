// Applies every migration to an in-process Postgres (PGlite) and checks who
// may read and change what. Run: npm run test:db
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { PGlite, type Transaction } from '@electric-sql/pglite';

const migrationsDir = new URL('../supabase/migrations/', import.meta.url);
const db = new PGlite();
const adminId = '11111111-1111-4111-8111-111111111111';
const visitorId = '22222222-2222-4222-8222-222222222222';

type Role = 'anon' | 'authenticated' | 'service_role';

async function as<T>(role: Role, sub: string | null, run: (tx: Transaction) => Promise<T>): Promise<T> {
  let result: T | undefined;
  try {
    await db.transaction(async (tx) => {
      await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(sub ? { sub, role } : { role })]);
      await tx.exec(`set local role ${role}`);
      result = await run(tx);
      await tx.rollback();
    });
  } catch (error) {
    if ((error as Error).message !== 'Transaction rolled back') throw error;
  }
  return result as T;
}

const rows = async (role: Role, sub: string | null, sql: string, params: unknown[] = []) => (await as(role, sub, (tx) => tx.query<Record<string, any>>(sql, params))).rows;

async function rejects(role: Role, sub: string | null, sql: string, params: unknown[] = []) {
  await assert.rejects(as(role, sub, (tx) => tx.query(sql, params)));
}

before(async () => {
  await db.exec(readFileSync(new URL('./supabase-platform.sql', import.meta.url), 'utf8'));
  const files = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();
  for (const file of files) await db.exec(readFileSync(new URL(file, migrationsDir), 'utf8'));
  // The CMS migrations must be safe to run twice.
  for (const file of files.filter((file) => file >= '20261023')) await db.exec(readFileSync(new URL(file, migrationsDir), 'utf8'));
  await db.query(`insert into auth.users (id, email) values ($1, 'dennis@example.test'), ($2, 'bezoeker@example.test')`, [adminId, visitorId]);
  await db.query(`insert into public.admin_users (user_id) values ($1)`, [adminId]);
  await db.query(`insert into public.reviews (name, email, city, project, rating, text, status, action_token_hash) values
    ('Anna', 'anna@example.test', 'Almere', 'Badkamer', 5, 'Heel tevreden over de nieuwe badkamer.', 'approved', 'hash-1'),
    ('Bram', 'bram@example.test', 'Weesp', 'Toilet', 4, 'Nog niet beoordeelde review over de wc.', 'pending', 'hash-2')`);
  await db.query(`insert into public.quote_requests (name, email, phone, service, message) values ('Klant', 'klant@example.test', '0612345678', 'badkamer', 'Graag een offerte voor de badkamer.')`);
});

test('the seed loads the default content', async () => {
  const [{ count: projects }] = (await db.query<{ count: number }>(`select count(*)::int as count from public.projects where status = 'published'`)).rows;
  const [{ count: photos }] = (await db.query<{ count: number }>(`select count(*)::int as count from public.project_photos`)).rows;
  const [{ count: missingCovers }] = (await db.query<{ count: number }>(`select count(*)::int as count from public.projects where cover_media_id is null`)).rows;
  assert.equal(projects, 47);
  assert.equal(photos, 54);
  assert.equal(missingCovers, 0);
  assert.equal((await db.query(`select 1 from public.calculator_options`)).rows.length, 15);
});

test('visitors read published content only', async () => {
  await db.query(`update public.projects set status = 'hidden' where slug = 'badkamer-diemen'`);
  const visible = await rows('anon', null, `select slug from public.projects`);
  assert.equal(visible.length, 46);
  assert.ok(!visible.some((row) => row.slug === 'badkamer-diemen'));
  const hiddenPhotos = await rows('anon', null, `select m.id from public.media m where m.static_key = 'natalie-diemen-1'`);
  assert.equal(hiddenPhotos.length, 0, 'photos of hidden projects stay private');
  assert.equal((await rows('anon', null, `select id from public.project_photos`)).length, 52);
  // A photo chosen for a fixed place on a page is public, even from a hidden project.
  await db.query(`insert into public.site_content (key, value_nl) select 'photo.bathroomHero', id::text from public.media where static_key = 'natalie-diemen-1'`);
  assert.equal((await rows('anon', null, `select m.id from public.media m where m.static_key = 'natalie-diemen-1'`)).length, 1, 'chosen page photos are public');
  await db.query(`delete from public.site_content where key = 'photo.bathroomHero'`);
  await db.query(`update public.projects set status = 'published' where slug = 'badkamer-diemen'`);
  assert.equal((await rows('anon', null, `select 1 from public.business_settings`)).length, 1);
  assert.equal((await rows('anon', null, `select 1 from public.calculator_tiers`)).length, 3);
});

test('visitors cannot read e-mail addresses, quote requests or pending reviews', async () => {
  await rejects('anon', null, `select email from public.reviews`);
  await rejects('anon', null, `select action_token_hash from public.reviews`);
  assert.deepEqual(await rows('anon', null, `select name from public.reviews`), [{ name: 'Anna' }]);
  assert.equal((await rows('anon', null, `select * from public.quote_requests`)).length, 0);
  assert.equal((await rows('authenticated', visitorId, `select * from public.quote_requests`)).length, 0);
});

test('visitors and logged-in non-admins cannot change content', async () => {
  for (const [role, sub] of [['anon', null], ['authenticated', visitorId]] as const) {
    await rejects(role, sub, `select public.save_project('{"slug":"x-y","category":"badkamer","title_nl":"Test"}'::jsonb)`);
    await rejects(role, sub, `select public.save_calculator('{"rooms":[],"options":[]}'::jsonb)`);
    assert.equal((await rows(role, sub, `update public.projects set title_nl = 'Gehackt' returning id`)).length, 0);
    assert.equal((await rows(role, sub, `update public.business_settings set phone_display = '0000000' returning id`)).length, 0);
    await rejects(role, sub, `insert into public.site_content (key, value_nl) values ('marketing.heroTitle', 'Gehackt')`);
    await rejects(role, sub, `insert into storage.objects (bucket_id, name) values ('project-photos', 'x/test.webp')`);
  }
  assert.equal((await rows('authenticated', visitorId, `update public.reviews set status = 'approved' returning id`)).length, 0);
});

test('visitors cannot delete content, post reviews directly or touch quote requests', async () => {
  for (const [role, sub] of [['anon', null], ['authenticated', visitorId]] as const) {
    assert.equal((await rows(role, sub, `delete from public.projects returning id`)).length, 0);
    assert.equal((await rows(role, sub, `delete from public.faqs returning id`)).length, 0);
    await rejects(role, sub, `delete from public.reviews`);
    await rejects(role, sub, `insert into public.reviews (name, email, rating, text) values ('X', 'x@example.com', 5, 'Nep review van buitenaf')`);
    await rejects(role, sub, `select public.save_faqs('badkamer', '[]'::jsonb)`);
    await rejects(role, sub, `select public.reorder_projects(array[]::uuid[])`);
    // Refused outright or zero rows changed: both mean nothing happened.
    for (const sql of [`update public.quote_requests set status = 'done' returning id`, `delete from storage.objects where bucket_id = 'project-photos' returning id`]) {
      const changed = await rows(role, sub, sql).then((result) => result.length, () => 0);
      assert.equal(changed, 0, sql);
    }
  }
});

test('the admin can save a project with photos atomically', async () => {
  const media = await rows('authenticated', adminId, `select id from public.media where static_key in ('wc-5', 'wc-6') order by static_key`);
  const created = await as('authenticated', adminId, async (tx) => {
    const payload = { slug: 'nieuw-toilet', category: 'toilet', title_nl: 'Nieuw toilet', status: 'published', cover_media_id: media[1].id, photos: [{ media_id: media[1].id }, { media_id: media[0].id, kind: 'before' }] };
    const [{ save_project: id }] = (await tx.query<{ save_project: string }>(`select public.save_project($1::jsonb)`, [JSON.stringify(payload)])).rows;
    const photos = (await tx.query(`select kind from public.project_photos where project_id = $1 order by sort_order`, [id])).rows;
    const [first] = (await tx.query<{ slug: string }>(`select slug from public.projects order by sort_order limit 1`)).rows;
    return { photos, first };
  });
  assert.deepEqual(created.photos, [{ kind: 'result' }, { kind: 'before' }]);
  assert.equal(created.first.slug, 'nieuw-toilet', 'new projects appear first');

  await rejects('authenticated', adminId, `select public.save_project($1::jsonb)`, [JSON.stringify({ slug: 'Ongeldige Slug!', category: 'toilet', title_nl: 'Test' })]);
});

test('the admin can reorder projects, moderate reviews and handle requests', async () => {
  await as('authenticated', adminId, async (tx) => {
    const ids = (await tx.query<{ id: string }>(`select id from public.projects order by sort_order desc`)).rows.map((row) => row.id);
    await tx.query(`select public.reorder_projects($1::uuid[])`, [ids]);
    const [first] = (await tx.query<{ id: string }>(`select id from public.projects order by sort_order limit 1`)).rows;
    assert.equal(first.id, ids[0]);
    const approved = await tx.query(`update public.reviews set status = 'approved', approved_at = now() where name = 'Bram' returning id`);
    assert.equal(approved.rows.length, 1);
    const updated = await tx.query(`update public.quote_requests set status = 'in_behandeling', admin_notes = 'Gebeld' returning id`);
    assert.equal(updated.rows.length, 1);
  });
  await rejects('authenticated', adminId, `update public.quote_requests set estimate_total = 1`);
  await rejects('authenticated', adminId, `update public.reviews set text = 'Aangepaste tekst van de klant'`);
});

test('the admin can save the calculator, and broken price lists are refused', async () => {
  const config = {
    rooms: [{ room_type: 'wc', label_nl: 'WC', base_price: 4000, included_area: 2, tiers: [{ from_area: 2, rate_per_m2: 850 }] }],
    options: [
      { id: 'spotjes', group_id: 'afwerking', label_nl: 'Spotjes', price: 525, rooms: ['badkamer', 'wc'], conflicts_with: [] },
      { id: 'nis', group_id: 'tegelwerk', label_nl: 'Nis', price: 550, rooms: ['wc'], conflicts_with: ['spotjes'] },
    ],
  };
  const saved = await as('authenticated', adminId, async (tx) => {
    await tx.query(`select public.save_calculator($1::jsonb)`, [JSON.stringify(config)]);
    return (await tx.query(`select id, price from public.calculator_options order by id`)).rows;
  });
  assert.deepEqual(saved, [{ id: 'nis', price: 550 }, { id: 'spotjes', price: 525 }]);
  const broken = { ...config, options: [{ ...config.options[1], conflicts_with: ['bestaat_niet'] }] };
  await rejects('authenticated', adminId, `select public.save_calculator($1::jsonb)`, [JSON.stringify(broken)]);
  await rejects('authenticated', adminId, `select public.save_calculator('{"rooms":[]}'::jsonb)`);
});

test('the admin can save business details with an upsert', async () => {
  const saved = await rows('authenticated', adminId, `insert into public.business_settings (id, company_name, phone_display, phone_link, whatsapp_number, email) values (1, 'Denra Badkamers', '+31 6 00 00 00 00', '+31600000000', '31600000000', 'test@example.test') on conflict (id) do update set phone_display = excluded.phone_display returning phone_display`);
  assert.deepEqual(saved, [{ phone_display: '+31 6 00 00 00 00' }]);
  await rejects('authenticated', visitorId, `insert into public.business_settings (id, company_name, phone_display, phone_link, whatsapp_number, email) values (1, 'X', '0000000', '0000000000', '0000000000', 'x@example.test') on conflict (id) do update set company_name = excluded.company_name`);
});

test('the admin can upload to the photo bucket', async () => {
  const inserted = await rows('authenticated', adminId, `insert into storage.objects (bucket_id, name) values ('project-photos', 'uploads/test.webp') returning name`);
  assert.equal(inserted.length, 1);
});

