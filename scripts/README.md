# Database Reset Scripts

Questi script ti permettono di pulire completamente il database per ripartire da zero durante lo sviluppo.

## 🚨 ATTENZIONE
**Questi script cancelleranno TUTTI i dati dal database. Usali solo in ambiente di sviluppo!**

## Opzioni disponibili

### 1. Reset rapido (solo dati)
Cancella tutti i dati mantenendo la struttura del database:

```bash
npm run db:reset
```

### 2. Reset completo (schema + dati)
Ricrea completamente il database e applica tutte le migrazioni:

```bash
npm run db:reset-full
```

### 3. Reset interattivo
Script guidato con opzioni multiple:

```bash
npm run db:reset-interactive
# oppure direttamente:
./scripts/reset-database.sh
```

### 4. Reset manuale con SQL
Esegui direttamente lo script SQL:

```bash
npx prisma db execute --file scripts/reset-db.sql
```

## File inclusi

- **`reset-db.sql`** - Script SQL per cancellare tutti i dati
- **`reset-database.sh`** - Script bash interattivo con opzioni multiple
- **`reset-db.js`** - Script Node.js (deprecato, usa SQL)

## Cosa viene cancellato

Tutti i dati dalle seguenti tabelle (in ordine):
1. `purchase` - Acquisti e transazioni
2. `entitlement` - Piani e sottoscrizioni utenti
3. `stripe_customer` - Clienti Stripe 
4. `stripe_event` - Eventi webhook Stripe
5. `verification` - Token di verifica email
6. `session` - Sessioni utente
7. `account` - Account OAuth collegati
8. `user` - Utenti registrati

## Dopo il reset

Dopo aver resettato il database:

1. **Riavvia il server dev** se è in esecuzione
2. **Rilogga** se eri autenticato
3. **Ricrea gli utenti di test** se necessario

## Esempi d'uso

```bash
# Reset rapido durante sviluppo
npm run db:reset

# Reset completo quando cambi lo schema
npm run db:reset-full

# Reset guidato con conferme
npm run db:reset-interactive
```