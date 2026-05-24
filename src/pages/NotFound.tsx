import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl font-semibold text-[#8B6F47]/20 mb-4">404</p>
        <h1 className="font-serif text-3xl font-semibold text-[#2C2416] mb-4">Pagina niet gevonden</h1>
        <p className="text-[#6B5D50] mb-8">De pagina die u zoekt bestaat niet of is verplaatst.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#8B6F47] text-white font-medium px-8 py-4 rounded-full hover:bg-[#7A5F3A] hover:scale-105 transition-all duration-200 text-sm"
        >
          <ArrowLeft size={16} />
          Terug naar home
        </Link>
      </div>
    </main>
  );
}