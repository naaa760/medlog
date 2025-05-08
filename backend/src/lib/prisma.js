const { PrismaClient } = require("@prisma/client");

// Create a single instance of Prisma to share across the app
const prisma = new PrismaClient();

module.exports = { prisma };
