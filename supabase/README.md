# Review moderation setup

1. Create a Supabase project and run [the review migration](./migrations/20261008123000_create_reviews.sql) in its SQL editor.
2. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Vercel project environment. Keep the service-role key server-only; do not prefix it with `VITE_`.
3. Set `REVIEW_RECIPIENT_EMAIL` to the inbox that should receive moderation emails. If omitted, the quote-recipient email is used.

Each submitted review is stored as `pending`. The moderation email links to a confirmation page where **Approve** publishes the review and **Delete** removes it from public use. Both actions require the email's secret link; a link visit alone never changes a review.
