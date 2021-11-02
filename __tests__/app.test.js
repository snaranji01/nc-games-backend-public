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



    describe('/api/reviews', () => {
        describe('/api/reviews/review:id', () => {
            test('status:200 GET - returns the review with a review_id specified in the URL parameter, under the "review" key', () => {
                return request(app)
                    .get('/api/reviews/1')
                    .expect(200)
                    .then(({ body: { review } }) => {
                        expect(review).toMatchObject({
                            title: expect.any(String),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            review_img_url: expect.any(String),
                            review_body: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            review_votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    })
            })
        })
    })
})


/* 
            test('status:200, returns json response of an array of review objects under the "reviews" key', () => {
                return request(app)
                    .get('/api/reviews')
                    .expect(200)
                    .then(({ body: { reviews } }) => {
                        expect(reviews).toHaveLength(13);
                        reviews.forEach(review => {
                            expect(review).toMatchObject({
                                title: expect.any(String),
                                designer: expect.any(String),
                                owner: expect.any(String),
                                review_img_url: expect.any(String),
                                review_body: expect.any(String),
                                category: expect.any(String),
                                created_at: expect.any(String),
                                review_votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        })
                    })
            })
             */
