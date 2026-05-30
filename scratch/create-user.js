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
  const email = 'test@dhikra.dz';
  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      emailVerified: new Date(),
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
      emailVerified: new Date(),
    }
  });
  
  console.log('SUCCESS: Pre-verified customer test account created!');
  console.log('Email:', user.email);
  console.log('Password:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
