const request = require('supertest');
const app = require('../app.js');

const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
    /* describe('GET /api', () => {
        test('status:200, returns a JSON representation of all available endpoints from the /api', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({body: {}}) => {
                    expect(body).objectContaining({
                        description: expect.any(String),
                    });
                });
        })
    }) */
    describe('/api/categories', () => {
        describe('GET all categories', () => {
            test('status:200, returns json response of an array of category objects under the "categories" key', () => {
                return request(app)
                    .get('/api/categories')
                    .expect(200)
                    .then(({ body: { categories } }) => {
                        console.log(categories)
                        expect(categories).toHaveLength(4);
                        categories.forEach(category => {
                            expect(category).toMatchObject({
                                slug: expect.any(String),
                                description: expect.any(String),
                            })
                        })
                    })
            })
        })
    })
})
