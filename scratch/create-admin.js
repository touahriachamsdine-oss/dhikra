const path = require('path');
// Load environment variables from .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ws = require('ws');
const { neonConfig } = require('@neondatabase/serverless');
// Polyfill WebSocket constructor for Neon serverless adapter
neonConfig.webSocketConstructor = ws;

const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const bcrypt = require('bcryptjs');

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@dhikra.dz';
  const password = 'Dhikra@Admin2026!'; // Fallback password from seed API
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Administrateur',
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  });
  
  console.log('SUCCESS: Admin test account created/verified!');
  console.log('Email:', user.email);
  console.log('Role:', user.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
