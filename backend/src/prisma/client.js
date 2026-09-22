// backend/src/prisma/client.js
const { PrismaClient } = require('@prisma/client');

// Enable query logging in development
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
