const request = require('supertest');
const app = require('../app.js');

const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('API', () => {
    test('status:404 for /notARoute. Returns "404 Error: Route not found" on "msg" key', () => {
        return request(app)
            .get('/notARoute')
            .expect('Content-Type', /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('404 Error: Route not found')
            })
    })
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
            test('status:200 - returns json response of an array of category objects under the "categories" key', () => {
                return request(app)
                    .get('/api/categories')
                    .expect('Content-Type', /json/)
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
            describe('GET request', () => {
                test('status:200 - returns the review with a review_id specified in the URL parameter, under the "review" key', () => {
                    return request(app)
                        .get('/api/reviews/1')
                        .expect('Content-Type', /json/)
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
                test('status:404 - returns the error message "404 Error, no review found with a review_id of *insert review_id here*" under the "msg" key', () => {
                    return request(app)
                        .get('/api/reviews/88')
                        .expect('Content-Type', /json/)
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe('404 Error, no review found with a review_id of 88')
                        })
                })
                test('status:400 - When provided review_id is not a number, returns the error message "400 Error: invalid input_id, *insertInvalidInputHere*, provided', () => {
                    return request(app)
                        .get('/api/reviews/myInvalidStringInput')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe('400 Error: invalid input_id, myInvalidStringInput, provided')
                        })
                })
            })

            describe('PATCH request', () => {
                test('status:200 - Increments/decrements review_votes of review with specified review_id by amount specified in request body, then responds with updated review object, on "review" key.', () => {
                    return request(app)
                        .patch('/api/reviews/1/')
                        .send({ inc_votes: 10 })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .then(({ body: { review } }) => {
                            expect(review).toEqual({
                                review_id: 1,
                                title: 'Agricola',
                                designer: 'Uwe Rosenberg',
                                owner: 'mallionaire',
                                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                                review_body: 'Farmyard fun!',
                                category: 'euro game',
                                created_at: '2021-01-18T10:00:20.514Z',
                                review_votes: 11,
                                comment_count: 0
                              })
                        })
                })
                test('status:404 - returns the error message "404 Error, no review found with a review_id of *insert review_id here*" under the "msg" key', () => {
                    return request(app)
                        .get('/api/reviews/88')
                        .expect('Content-Type', /json/)
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            console.log({msg1: msg})
                            expect(msg).toBe('404 Error, no review found with a review_id of 88')
                        })
                })
                test('status:400 - When provided review_id is not a number, returns the error message "400 Error: invalid input_id, *insertInvalidInputHere*, provided', () => {
                    return request(app)
                        .get('/api/reviews/myInvalidStringInput')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            console.log({msg2: msg})
                            expect(msg).toBe('400 Error: invalid input_id, myInvalidStringInput, provided')
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
