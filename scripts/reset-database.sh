#!/bin/bash

echo "🗑️  Reset completo del database SaaS Forge Kit"
echo "=============================================="
echo ""

# Chiedi conferma
read -p "⚠️  ATTENZIONE: Questo cancellerà TUTTI i dati dal database. Continuare? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operazione annullata."
    exit 1
fi

echo ""
echo "🔄 Avvio reset del database..."

# Opzione 1: Reset completo con Prisma (ricrea schema)
echo "📝 Opzione 1: Reset completo (ricrea tutto lo schema)"
read -p "Vuoi fare un reset completo che ricrea lo schema? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Eseguendo reset completo dello schema..."
    npx prisma migrate reset --force --skip-generate
    echo "✅ Reset completo completato!"
    exit 0
fi

# Opzione 2: Solo cancellazione dati
echo ""
echo "📝 Opzione 2: Solo cancellazione dati (mantiene schema)"
read -p "Vuoi cancellare solo i dati mantenendo lo schema? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Cancellando solo i dati..."
    npx prisma db execute --file scripts/reset-db.sql
    echo "✅ Dati cancellati con successo!"
    exit 0
fi

echo "❌ Nessuna opzione selezionata. Operazione annullata."
exit 1