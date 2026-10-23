/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

// vite-imagetools: `?...&as=picture` returns responsive sources, other
// queries (for example `?w=1280&format=webp`) return a single URL.
interface ImagetoolsPicture {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

declare module '*&as=picture' {
  const picture: ImagetoolsPicture;
  export default picture;
}

declare module '*&format=webp' {
  const src: string;
  export default src;
}
