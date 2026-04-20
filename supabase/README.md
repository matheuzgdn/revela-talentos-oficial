# Supabase Operations

This project uses Supabase as the only active backend runtime.

## Local verification

```bash
npm run supabase:verify
```

## Remote deploy flow

1. Authenticate the CLI:

```bash
npx supabase login
```

2. Link the local project to the hosted project:

```bash
npx supabase link --project-ref nttjbhzigaxeohyclsiw
```

3. Push the database schema:

```bash
npx supabase db push
```

4. Set the live-stream secrets in the hosted project:

```bash
npx supabase secrets set HMS_APP_ACCESS_KEY=... HMS_APP_SECRET=... HMS_ROOM_ID=... HMS_SUBDOMAIN=...
```

5. Deploy the live token function:

```bash
npx supabase functions deploy generate-hms-token --project-ref nttjbhzigaxeohyclsiw --use-api
```

## Canonical files

- `supabase/migrations/` is the canonical migration source for CLI deploys.
- `supabase/schema.sql` is the schema snapshot used to generate the initial migration.
- `supabase/functions/generate-hms-token/` contains the live token edge function.
