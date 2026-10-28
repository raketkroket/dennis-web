import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';

/** Text links to the three service pages, for the dark call-to-action sections. */
export default function ServiceLinks() {
  const { t } = useLanguage();
  const services = [
    { label: t('form.bathroom'), path: '/badkamerrenovatie' },
    { label: t('form.toilet'), path: '/wc-renovatie' },
    { label: t('form.interior'), path: '/binnenrenovatie' },
  ];

  return (
    <p className="mt-6 text-sm text-[#cfbca7]">
      {t('site.serviceLinksLabel')}{' '}
      {services.map((service, index) => (
        <React.Fragment key={service.path}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          <Link to={service.path} className="text-[#f6f0e8] underline decoration-[#cfbca7]/50 underline-offset-4 hover:decoration-[#f6f0e8]">{service.label}</Link>
        </React.Fragment>
      ))}
    </p>
  );
}
