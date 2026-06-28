# Email notification setup

This project uses a Supabase database trigger to send an email through Resend whenever a new row is inserted into `public.diagnostic_submissions`.

## How it works

```text
diagnostic.html
-> Supabase Storage upload
-> Supabase table insert
-> PostgreSQL trigger calls Resend
-> Email arrives at austinyoan@gmail.com
```

## Setup

Run the local-only SQL file in Supabase SQL Editor:

```text
resend_email_trigger_setup.local.sql
```

That file contains the Resend API key, so it is ignored by Git and must not be committed.

## Test

Submit a diagnostic from `diagnostic.html`.

Expected:

- The submission appears in `public.diagnostic_submissions`.
- Uploaded photos appear in Storage bucket `diagnostic-uploads`.
- An email arrives at `austinyoan@gmail.com`.

## Remove test data

```sql
delete from public.diagnostic_submissions
where contact_email like '%example.com'
   or contact_name like 'CODX_%'
   or contact_name like 'FIELD_%'
   or contact_name like 'EMAIL_%';
```

Storage test images must be removed manually from:

```text
Storage -> diagnostic-uploads -> public
```
