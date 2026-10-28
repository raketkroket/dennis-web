-- The first seed stored an Instagram link with an @ in the path (not a valid
-- profile address) and a Facebook address that is not Denra's page. Only the
-- seeded values are changed, so links Dennis already edited in the admin are kept.

update public.business_settings set instagram_url = 'https://www.instagram.com/denrabadkamers' where instagram_url = 'https://instagram.com/@denrabadkamers';
update public.business_settings set facebook_url = 'https://www.facebook.com/profile.php?id=100061153247453' where facebook_url = 'https://facebook.com/denrabadkamers';
