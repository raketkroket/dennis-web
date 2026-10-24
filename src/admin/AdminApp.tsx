import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AuthProvider, useAuth } from './auth';
import AdminLayout from './AdminLayout';
import { ForgotPasswordPage, LoginPage, NewPasswordPage, NotAdminPage, NotConfiguredPage } from './LoginPages';
import { LoadingBlock, UnsavedChangesProvider } from './ui';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import ProjectEditor from './pages/ProjectEditor';
import Photos from './pages/Photos';
import Reviews from './pages/Reviews';
import { RequestDetail, RequestsList } from './pages/Requests';
import SiteContent from './pages/SiteContent';
import CalculatorAdmin from './pages/CalculatorAdmin';
import Business from './pages/Business';

function AdminRoutes() {
  const { state } = useAuth();
  if (state.status === 'loading') return <div className="min-h-screen bg-denra-ivory"><LoadingBlock label="Beheer openen…" /></div>;

  return (
    <Routes>
      <Route path="wachtwoord" element={<ForgotPasswordPage />} />
      <Route path="nieuw-wachtwoord" element={<NewPasswordPage />} />
      {state.status === 'signedOut' && <Route path="*" element={<LoginPage />} />}
      {state.status === 'notAdmin' && <Route path="*" element={<NotAdminPage />} />}
      {state.status === 'recovery' && <Route path="*" element={<Navigate to="/admin/nieuw-wachtwoord" replace />} />}
      {state.status === 'admin' && (
        <Route element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="projecten" element={<Projects />} />
          <Route path="projecten/:id" element={<ProjectEditor />} />
          <Route path="fotos" element={<Photos />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="aanvragen" element={<RequestsList />} />
          <Route path="aanvragen/:id" element={<RequestDetail />} />
          <Route path="website" element={<SiteContent />} />
          <Route path="calculator" element={<CalculatorAdmin />} />
          <Route path="bedrijf" element={<Business />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default function AdminApp() {
  if (!supabase) return <NotConfiguredPage />;
  return (
    <AuthProvider client={supabase}>
      <UnsavedChangesProvider>
        <AdminRoutes />
      </UnsavedChangesProvider>
    </AuthProvider>
  );
}
