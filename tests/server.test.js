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

  it('should be able to login', async (done) => {
    await request(app).post('/signup').send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'Alex',
      lastName: 'Test',
    });

    const response = await request(app).post('/login').send({
      email: 'test@test.com',
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.anything());
    done();
  });

  it('Logged In - should be able to add character', async (done) => {
    await request(app).post('/signup').send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'Alex',
      lastName: 'Test',
    });

    const loginResponse = await request(app).post('/login').send({
      email: 'test@test.com',
      password: 'password',
    });
    const token = loginResponse.body.token || null;

    const response = await request(app)
      .post('/character/add')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Merci',
        race: 'Gnome',
        charClass: 'Ranger',
        attributes: {
          str: 10,
          dex: 10,
          con: 10,
          wis: 10,
          int: 10,
          cha: 10,
        },
      });

    expect(response.status).toBe(200);
    done();
  });
});
