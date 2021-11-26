const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('../src/models/user');
const app = require('../src/app');

describe('Project', () => {
  let mongoServer;
  beforeAll(async (done) => {
    mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    const URI = mongoServer.getUri();
    mongoose.set('debug', true);
    mongoose.connect(URI, () => {
      done();
    });
  });

  afterAll(async (done) => {
    mongoose.disconnect(done);
    await mongoServer.stop();
  });

  afterEach(async (done) => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }

    done();
  });

  it('should be able to create a User', async (done) => {
    const response = await request(app).post('/signup').send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'Alex',
      lastName: 'Test',
    });

    expect(response.status).toBe(200);
    done();
  });

  it('should not be able to create a duplicate user', async (done) => {
    await request(app).post('/signup').send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'Alex',
      lastName: 'Test',
    });
    const response = await request(app).post('/signup').send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'Alex',
      lastName: 'Test',
    });
    expect(response.body.message).toBe('User already exists');
    done();
  });

  // it('should be able to create a project', async () => {
  //   const response = await request(app).post('/projects').send({
  //     title: 'Projeto Node.js IIIIIIIIIIIII',
  //     description: 'Um projeto muito massa!',
  //   });

  //   expect(response.status).toBe(200);
  // });

  // it('should not create a project if it has already been defined', async () => {
  //   await request(app).post('/projects').send({
  //     title: 'Projeto Node.js IIIIIIIIIIIII',
  //     description: 'Um projeto muito massa!',
  //   });

  //   const response = await request(app).post('/projects').send({
  //     title: 'Projeto Node.js IIIIIIIIIIIII',
  //     description: 'Um projeto muito massa!',
  //   });

  //   expect(response.body).toMatchObject({ error: 'Duplicated project' });
  // });

  // it('should be able to list all projects', async () => {
  //   const response = await request(app).get('/projects');

  //   expect(response.status).toBe(200);
  // });
});
