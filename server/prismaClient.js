// server/__mocks__/prismaClient.js

const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    // Add other prisma.user methods you use in tests
  },
  // Add other models if needed
};

module.exports = prisma;
