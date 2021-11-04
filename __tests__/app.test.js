const request = require('supertest');
const app = require('../app.js');

const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const { ascendingCompareFunc, descendingCompareFunc } = require('./compareFunctions.js');

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

        describe("GET request", () => {
            describe('Status:200 - Returns an Array of review Objects, on the "reviews" key', () => {
                test('When no URL query parameters are specified, returns Array sorted in descending order by the "created_at" date', () => {
                    return request(app)
                        .get('/api/reviews')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .then(({ body: { reviews } }) => {

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

                            expect(reviews).toBeSortedBy('created_at', {
                                descending: true
                            })

                        })
                })
                describe('When only a sort_by parameter is specified, returns Array sorted in descending order by specified column', () => {
                    test.each([
                        { column: "owner" },
                        { column: "title" },
                        { column: "review_id" },
                        { column: "category" },
                        { column: "review_img_url" },
                        { column: "created_at" },
                        { column: "review_votes" },
                        { column: "comment_count" }
                    ])('Check sort_by=$column', ({ column }) => {
                        return request(app)
                            .get(`/api/reviews?sort_by=${column}`)
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .then(({ body: { reviews } }) => {

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

                                expect(reviews).toBeSortedBy(column, {
                                    compare: descendingCompareFunc
                                })
                            })
                    });
                })
                describe('When sort_by and order are specified, returns Array sorted in the correct order by specified column', () => {
                    describe('Descending order specified', () => {
                        test.each([
                            { column: "owner" },
                            { column: "title" },
                            { column: "review_id" },
                            { column: "category" },
                            { column: "review_img_url" },
                            { column: "created_at" },
                            { column: "review_votes" },
                            { column: "comment_count" }
                        ])('Check sort_by=$column&order=desc', ({ column }) => {
                            return request(app)
                                .get(`/api/reviews?sort_by=${column}&order=desc`)
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .then(({ body: { reviews } }) => {

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

                                    expect(reviews).toBeSortedBy(column, {
                                        compare: descendingCompareFunc
                                    })
                                })
                        });
                    })
                    describe('Ascending order specified', () => {
                        test.each([
                            { column: "owner" },
                            { column: "title" },
                            { column: "review_id" },
                            { column: "category" },
                            { column: "review_img_url" },
                            { column: "created_at" },
                            { column: "review_votes" },
                            { column: "comment_count" }
                        ])('Check sort_by=$column&order=asc', ({ column }) => {
                            return request(app)
                                .get(`/api/reviews?sort_by=${column}&order=asc`)
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .then(({ body: { reviews } }) => {

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
                                    const ascendingCompareFunc = (a, b) => {
                                        return a - b
                                    }
                                    expect(reviews).toBeSortedBy(column, {
                                        compare: ascendingCompareFunc,
                                    })
                                })
                        });
                    })
                })
                describe('When valid sort_by, order and category query parameters are passed, returns correctly sorted, ordered and filtered Array', () => {
                    test('Initial test: /api/reviews?sort_by=review_votes&order=asc&category=children%27s+games', () => {
                        return request(app)
                            .get(`/api/reviews`)
                            .query(`?sort_by=review_votes&order=asc&category=children%27s+games`)
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .then(({ body: { reviews } }) => {

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

                                expect(reviews).toBeSortedBy('review_votes', {
                                    compare: ascendingCompareFunc,
                                })

                                reviews.forEach(review => {
                                    expect(review.category).not.toBe('euro game');
                                    expect(review.category).not.toBe('dexterity');
                                    expect(review.category).not.toBe('social deduction');
                                })


                            })
                    })
                    test.each([
                        { name: "Test 1", sortByColumn: "owner", sortOrder: "asc", filterCategory: "euro+game" },
                        { name: "Test 2", sortByColumn: "review_votes", sortOrder: "asc", filterCategory: "social+deduction" },
                        { name: "Test 3", sortByColumn: "comment_count", sortOrder: "desc", filterCategory: "children%27s+games" },
                        { name: "Test 4", sortByColumn: "title", sortOrder: "desc", filterCategory: "dexterity" },
                    ])('$name: Check sort_by=$sortByColumn&order=$sortOrder&category=$filterCategory', ({ sortByColumn, sortOrder, filterCategory }) => {
                        return request(app)
                            .get(`/api/reviews`)
                            .query(`?sort_by=${sortByColumn}&order=${sortOrder}&category=${filterCategory}`)
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .then(({ body: { reviews } }) => {
                                //check object structure
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

                                // check sort order
                                const returnCompareFunc = (sortOrder) => {
                                    if (sortOrder === 'asc') {
                                        return ascendingCompareFunc;
                                    } else if (sortOrder === 'desc') {
                                        return descendingCompareFunc
                                    }
                                }
                                if (reviews.length > 0) {
                                    expect(reviews).toBeSortedBy(sortByColumn, {
                                        compare: returnCompareFunc(sortOrder),
                                    })
                                }
                                // check category filtering
                                let decodedCategory = decodeURIComponent(filterCategory.replace('+', '%20'))
                                const notTheseCategories = ['euro game', 'social deduction', 'dexterity', "children's games"].filter(category => category !== decodedCategory);

                                reviews.forEach(review => {
                                    notTheseCategories.forEach(notThisCategory => {
                                        expect(review.category).not.toBe(notThisCategory)
                                    })
                                })
                            })
                            .catch(err => ({ errHere: err }))

                    });
                })

            })
        })
        describe('Status:400 - When provided an invalid input, returns a 400 response and corresponding error message on the "msg" key', () => {
            test('Invalid "sort_by" query parameter. Returns error message: "400 Error: invalid sort_by query parameter, *insertPassedSortByQueryHere*, was provided"', () => {
                return request(app)
                    .get('/api/reviews?sort_by=daffodil')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('400 Error: invalid sort_by query parameter, daffodil, was provided')
                    })
            })
            test('Invalid "order" query parameter. Returns error message: "400 Error: invalid order query parameter, *insertPassedOrderQueryHere*, was provided"', () => {
                return request(app)
                    .get('/api/reviews?order=inverted')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('400 Error: invalid order query parameter, inverted, was provided')
                    })
            })
        })

    })

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
                    .patch('/api/reviews/88')
                    .send({ inc_votes: 10 })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('404 Error, no review found with a review_id of 88')
                    })
            })
            test('status:400 - When provided review_id is not a number, returns the error message "400 Error: invalid input_id, *insertInvalidInputHere*, provided', () => {
                return request(app)
                    .patch('/api/reviews/myInvalidStringInput')
                    .send({ inc_votes: 10 })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('400 Error: invalid input_id, myInvalidStringInput, provided')
                    })
            })
        })
    })
})






// OLD 'test each sort_by parameter' Test Code Block
//
/* test('When only a sort_by parameter is specified, returns Array of review Objects sorted in descending order by specified column', async () => {
                    const columnNames = ["owner", "title", "review_id", "category", "review_img_url", "created_at", "review_votes", "comment_count"];

                    const promiseAssertionsArray = columnNames.map(async columnName => {
                        await request(app)
                        .get(`/api/reviews?sort_by=${columnName}`)
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .then(({ body: { reviews } }) => {

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

                            expect(reviews).toBeSortedBy(columnName, {
                                descending: true
                            })
                            //console.log(`Evaluated test for: ${columnName}`)
                        })
                    })
                    await Promise.all(promiseAssertionsArray)

                }) */

/* 
                test.each([
                    { name: "Test 1", sortByColumn: "owner" , sortOrder: "asc", filterCategory: "euro game"},
                    { name: "Test 2", sortByColumn: "review_votes" , sortOrder: "asc", filterCategory: "social deduction" },
                    { name: "Test 3", sortByColumn: "comment_count" , sortOrder: "desc", filterCategory: "children's games" },
                    { name: "Test 4", sortByColumn: "title" , sortOrder: "desc", filterCategory: "dexterity" },
                ])('$name: Check sort_by=$sortByColumn&order=$sortOrder&category=$filterCategory', ({ sortByColumn, sortOrder, filterCategory }) => {
                    return request(app)
                        .get(`/api/reviews?sort_by=${sortByColumn}&order=${sortOrder}&category=${filterCategory}`)
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .then(({ body: { reviews } }) => {
                            
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

                            // check sort order
                            const returnCompareFunc = (sortOrder) => {
                                if(sortOrder === 'asc'){
                                    return ascendingCompareFunc;
                                } else if (sortOrder === 'desc') {
                                    return descendingCompareFunc
                                }
                            }
                            if(reviews.length > 0) {
                                expect(reviews).toBeSortedBy(sortByColumn, {
                                compare: returnCompareFunc(sortOrder),
                            })

                            //
                            
                            }
                            
                        })
                });
*/
