import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🗑️  Iniziando il reset del database...');

    // Cancella tutti i dati in ordine di dipendenza (foreign keys)
    console.log('Cancellando purchases...');
    await prisma.purchase.deleteMany();
    
    console.log('Cancellando entitlements...');
    await prisma.entitlement.deleteMany();
    
    console.log('Cancellando stripe customers...');
    await prisma.stripeCustomer.deleteMany();
    
    console.log('Cancellando stripe events...');
    await prisma.stripeEvent.deleteMany();
    
    console.log('Cancellando verifications...');
    await prisma.verification.deleteMany();
    
    console.log('Cancellando sessions...');
    await prisma.session.deleteMany();
    
    console.log('Cancellando accounts...');
    await prisma.account.deleteMany();
    
    console.log('Cancellando users...');
    await prisma.user.deleteMany();

    // Verifica che tutto sia stato cancellato
    const counts = {
      users: await prisma.user.count(),
      accounts: await prisma.account.count(),
      sessions: await prisma.session.count(),
      verifications: await prisma.verification.count(),
      entitlements: await prisma.entitlement.count(),
      stripeCustomers: await prisma.stripeCustomer.count(),
      stripeEvents: await prisma.stripeEvent.count(),
      purchases: await prisma.purchase.count()
    };

    console.log('\n📊 Conteggio finale:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count}`);
    });

    const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    if (totalRecords === 0) {
      console.log('\n✅ Reset completato con successo! Il database è completamente pulito.');
    } else {
      console.log(`\n⚠️  Attenzione: ${totalRecords} record ancora presenti nel database.`);
    }

  } catch (error) {
    console.error('❌ Errore durante il reset del database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui solo se chiamato direttamente (non importato)
if (require.main === module) {
  resetDatabase();
}

export default resetDatabase;