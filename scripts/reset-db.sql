-- Script per cancellare tutti i dati dal database
-- Eseguire con: npx prisma db execute --file scripts/reset-db.sql

-- Disabilita i controlli di foreign key temporaneamente
SET session_replication_role = replica;

-- Cancella tutti i dati dalle tabelle (in ordine di dipendenza)
TRUNCATE TABLE "purchase" CASCADE;
TRUNCATE TABLE "entitlement" CASCADE;
TRUNCATE TABLE "stripe_customer" CASCADE;
TRUNCATE TABLE "stripe_event" CASCADE;
TRUNCATE TABLE "verification" CASCADE;
TRUNCATE TABLE "session" CASCADE;
TRUNCATE TABLE "account" CASCADE;
TRUNCATE TABLE "user" CASCADE;

-- Riabilita i controlli di foreign key
SET session_replication_role = DEFAULT;

-- Opzionale: Reset delle sequenze per gli ID (se usi SERIAL)
-- ALTER SEQUENCE user_id_seq RESTART WITH 1;
-- ALTER SEQUENCE purchase_id_seq RESTART WITH 1;
-- etc.

-- Messaggio di conferma
SELECT 'Database reset completato! Tutte le tabelle sono state svuotate.' as status;