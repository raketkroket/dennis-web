-- The first seed stored the Instagram link with an @ in the path, which is not
-- a valid profile address. Only the seeded value is changed, so a link Dennis
-- already edited in the admin is kept.

update public.business_settings set instagram_url = 'https://www.instagram.com/denrabadkamers' where instagram_url = 'https://instagram.com/@denrabadkamers';
