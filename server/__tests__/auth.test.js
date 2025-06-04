const request = require('supertest');
const app = require('../server');
const prisma = require('../prismaClient');
jest.mock('../prismaClient');

const bcrypt = require('bcryptjs');

describe('POST /api/auth/login', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test to avoid side effects
  });

  it('should fail with invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid@test.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should succeed with valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'valid@test.com',
      username: 'validuser',
      password: '$2a$10$hashedpassword',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'valid@test.com', password: 'correctpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', 'validuser');
  });

  it('should return 400 if email or password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return a JWT token on successful login', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'token@test.com',
      username: 'tokenuser',
      password: '$2a$10$hashedpassword',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'token@test.com', password: 'correctpass' });

    expect(res.body.token).toBeDefined();
  });
});

describe('POST /api/auth/signup', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create new user successfully', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    prisma.user.create.mockResolvedValue({
      id: 1,
      email: 'newuser@test.com',
      username: 'newuser',
      password: 'hashedpassword',
    });

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'newuser@test.com', username: 'newuser', password: 'mypassword' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', 'newuser');
    expect(res.body).toHaveProperty('email', 'newuser@test.com');

    bcrypt.hash.mockRestore();
  });

  it('should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: '', username: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
