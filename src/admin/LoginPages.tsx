import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import logo from '../assets/denra-logo.png';
import { useAuth } from './auth';
import { Notice, TextField } from './ui';

function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-denra-ivory px-4 py-10">
      <div className="w-full max-w-md">
        <img src={logo} alt="Denra Badkamers" className="mx-auto h-10 w-auto" />
        <div className="mt-8 border border-denra-line bg-white/80 p-6 sm:p-8">
          <h1 className="font-serif text-3xl">{title}</h1>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-denra-muted"><Link to="/" className="underline underline-offset-4">Naar de website</Link></p>
      </div>
    </main>
  );
}

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Vul uw e-mailadres en wachtwoord in.');
      return;
    }
    setBusy(true);
    setError((await signIn(email, password)) ?? '');
    setBusy(false);
  };

  return (
    <AuthShell title="Inloggen voor beheer">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <TextField label="E-mailadres" type="email" inputMode="email" value={email} onChange={setEmail} />
        <TextField label="Wachtwoord" type="password" value={password} onChange={setPassword} />
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Inloggen
        </button>
        <p className="text-center text-[15px]"><Link to="/admin/wachtwoord" className="underline underline-offset-4">Wachtwoord vergeten?</Link></p>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const { requestReset } = useAuth();
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const error = await requestReset(email);
    setResult(error ? { tone: 'error', text: error } : { tone: 'success', text: 'Als dit e-mailadres bij een beheerder hoort, ontvangt u binnen enkele minuten een e-mail met een link om een nieuw wachtwoord te kiezen.' });
    setBusy(false);
  };

  return (
    <AuthShell title="Wachtwoord vergeten">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <TextField label="E-mailadres" type="email" inputMode="email" value={email} onChange={setEmail} />
        {result && <Notice tone={result.tone}>{result.text}</Notice>}
        <button type="submit" disabled={busy || !email.trim()} className="btn-primary w-full">Stuur mij een link</button>
        <p className="text-center text-[15px]"><Link to="/admin" className="underline underline-offset-4">Terug naar inloggen</Link></p>
      </form>
    </AuthShell>
  );
}

export function NewPasswordPage() {
  const { setPassword, state } = useAuth();
  const navigate = useNavigate();
  const [password, setValue] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');

  if (state.status === 'signedOut') {
    return (
      <AuthShell title="Link verlopen">
        <Notice tone="warning">Deze link is verlopen of al gebruikt. Vraag een nieuwe link aan.</Notice>
        <Link to="/admin/wachtwoord" className="btn-primary mt-6 w-full">Nieuwe link aanvragen</Link>
      </AuthShell>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 10) return setError('Kies een wachtwoord van minstens 10 tekens.');
    if (password !== repeat) return setError('De twee wachtwoorden zijn niet gelijk.');
    const failure = await setPassword(password);
    if (failure) return setError(failure);
    navigate('/admin');
  };

  return (
    <AuthShell title="Nieuw wachtwoord kiezen">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <TextField label="Nieuw wachtwoord" type="password" value={password} onChange={setValue} help="Minstens 10 tekens." />
        <TextField label="Herhaal het wachtwoord" type="password" value={repeat} onChange={setRepeat} />
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" className="btn-primary w-full">Wachtwoord opslaan</button>
      </form>
    </AuthShell>
  );
}

export function NotAdminPage() {
  const { signOut, state } = useAuth();
  const email = state.status === 'notAdmin' ? state.session.user.email : '';
  return (
    <AuthShell title="Geen beheerrechten">
      <p className="leading-relaxed text-denra-muted">U bent ingelogd als <strong className="text-denra-ink">{email}</strong>, maar dit account mag de website niet beheren.</p>
      <p className="mt-3 leading-relaxed text-denra-muted">Is dit wel uw beheeraccount? Vraag dan de websitebouwer om het toe te voegen (zie supabase/README.md).</p>
      <button type="button" onClick={signOut} className="btn-secondary mt-6 w-full">Uitloggen</button>
    </AuthShell>
  );
}

export function NotConfiguredPage() {
  return (
    <AuthShell title="Beheer is nog niet gekoppeld">
      <p className="leading-relaxed text-denra-muted">De website draait nu met de ingebouwde inhoud. Om projecten, foto's en teksten zelf te beheren moet de website eerst aan Supabase worden gekoppeld.</p>
      <p className="mt-3 leading-relaxed text-denra-muted">Voor de websitebouwer: zet <code className="bg-denra-stone px-1">VITE_SUPABASE_URL</code> en <code className="bg-denra-stone px-1">VITE_SUPABASE_ANON_KEY</code> in Vercel en volg supabase/README.md.</p>
    </AuthShell>
  );
}
