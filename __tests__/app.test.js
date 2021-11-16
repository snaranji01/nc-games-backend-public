const request = require("supertest");
const app = require("../app.js");

const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

// compare functions for use with jest-sorted
exports.descendingCompareFunc = (a, b) => {
  return b - a
}
exports.ascendingCompareFunc = (a, b) => {
  return a - b
}

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("API", () => {
  test('status:404 for /notARoute. Returns "404 Error: Route not found" on "msg" key', () => {
    return request(app)
      .get("/notARoute")
      .expect("Content-Type", /json/)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 Error: Route not found");
      });
  });
  describe("GET /api", () => {
    test("status:200, returns a JSON representation of all available endpoints from the /api", () => {
      return request(app).get("/api").expect(200);
    });
  });
  // /api/categories
  describe("/api/categories", () => {
    describe("GET all categories", () => {
      test('status:200 - returns json response of an array of category objects under the "categories" key', () => {
        return request(app)
          .get("/api/categories")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(({ body: { categories } }) => {
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
              expect(category).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              });
            });
          });
      });
    });
  });
  // /api/reviews
  describe("/api/reviews", () => {
    describe("GET request", () => {
      describe("Status 200", () => {
        test('When no URL query parameters are specified, returns array of Reviews sorted in descending order by the "created_at" date', () => {
          return request(app)
            .get("/api/reviews")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { reviews } }) => {
              reviews.forEach((review) => {
                expect(review).toMatchObject({
                  title: expect.any(String),
                  designer: expect.any(String),
                  owner: expect.any(String),
                  review_img_url: expect.any(String),
                  review_body: expect.any(String),
                  category: expect.any(String),
                  created_at: expect.any(String),
                  review_votes: expect.any(Number),
                  comment_count: expect.any(Number),
                });
              });

              expect(reviews).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        describe("When only 1 query parameter is provided", () => {
          describe("Only a sort_by parameter. Returns array sorted in descending order by specified column", () => {
            test.each([
              { column: "owner" },
              { column: "title" },
              { column: "review_id" },
              { column: "category" },
              { column: "review_img_url" },
              { column: "created_at" },
              { column: "review_votes" },
              { column: "comment_count" },
            ])("Check sort_by=$column", ({ column }) => {
              return request(app)
                .get(`/api/reviews?sort_by=${column}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(({ body: { reviews } }) => {
                  // check object data types
                  reviews.forEach((review) => {
                    expect(review).toMatchObject({
                      title: expect.any(String),
                      designer: expect.any(String),
                      owner: expect.any(String),
                      review_img_url: expect.any(String),
                      review_body: expect.any(String),
                      category: expect.any(String),
                      created_at: expect.any(String),
                      review_votes: expect.any(Number),
                      comment_count: expect.any(Number),
                    });
                  });
                  // check sorted in correct order
                  expect(reviews).toBeSortedBy(column, {
                    compare: descendingCompareFunc,
                  });
                });
            });
          });
          describe('Only order parameter. Returns array sorted in the correct order by "created_at" date', () => {
            test.each([{ order: "asc" }, { order: "desc" }])(
              "Check order=$order",
              ({ order }) => {
                return request(app)
                  .get(`/api/reviews?order=${order}`)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then(({ body: { reviews } }) => {
                    // check object data types
                    reviews.forEach((review) => {
                      expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        review_votes: expect.any(Number),
                        comment_count: expect.any(Number),
                      });
                    });
                    // check sorted in correct order
                    const getComparisonFunc = () => {
                      if (order === "desc") {
                        return descendingCompareFunc;
                      } else if (order === "asc") {
                        return ascendingCompareFunc;
                      }
                    };
                    expect(reviews).toBeSortedBy("created_at", {
                      compare: getComparisonFunc(order),
                    });
                  });
              }
            );
          });
          describe("Only category parameter. Returns array sorted in descending order, filtered to only reviews with specified category", () => {
            test.each([
              { category: "euro%20game" },
              { category: "social%20deduction" },
              { category: "dexterity" },
              { category: "children%27s%20games" },
            ])("Check category=$category", ({ category }) => {
              return request(app)
                .get(`/api/reviews?category=${category}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(({ body: { reviews } }) => {
                  // check object data types
                  reviews.forEach((review) => {
                    expect(review).toMatchObject({
                      title: expect.any(String),
                      designer: expect.any(String),
                      owner: expect.any(String),
                      review_img_url: expect.any(String),
                      review_body: expect.any(String),
                      category: expect.any(String),
                      created_at: expect.any(String),
                      review_votes: expect.any(Number),
                      comment_count: expect.any(Number),
                    });
                  });

                  // check every category value is $category
                  const categoryDecoded = decodeURI(category);
                  reviews.forEach((review) => {
                    expect(review.category).toBe(`${categoryDecoded}`);
                  });
                  // check sorted in correct order
                  expect(reviews).toBeSortedBy("created_at", {
                    compare: descendingCompareFunc,
                  });
                });
            });
          });
        });
        describe("When 2 query parameters are provided", () => {
          describe("sort_by and order are provided", () => {
            describe("Descending order specified", () => {
              test.each([
                { column: "owner" },
                { column: "title" },
                { column: "review_id" },
                { column: "category" },
                { column: "review_img_url" },
                { column: "created_at" },
                { column: "review_votes" },
                { column: "comment_count" },
              ])("Check sort_by=$column&order=desc", ({ column }) => {
                return request(app)
                  .get(`/api/reviews?sort_by=${column}&order=desc`)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then(({ body: { reviews } }) => {
                    reviews.forEach((review) => {
                      expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        review_votes: expect.any(Number),
                        comment_count: expect.any(Number),
                      });
                    });

                    expect(reviews).toBeSortedBy(column, {
                      compare: descendingCompareFunc,
                    });
                  });
              });
            });
            describe("Ascending order specified", () => {
              test.each([
                { column: "owner" },
                { column: "title" },
                { column: "review_id" },
                { column: "category" },
                { column: "review_img_url" },
                { column: "created_at" },
                { column: "review_votes" },
                { column: "comment_count" },
              ])("Check sort_by=$column&order=asc", ({ column }) => {
                return request(app)
                  .get(`/api/reviews?sort_by=${column}&order=asc`)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then(({ body: { reviews } }) => {
                    reviews.forEach((review) => {
                      expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        review_votes: expect.any(Number),
                        comment_count: expect.any(Number),
                      });
                    });
                    const ascendingCompareFunc = (a, b) => {
                      return a - b;
                    };
                    expect(reviews).toBeSortedBy(column, {
                      compare: ascendingCompareFunc,
                    });
                  });
              });
            });
          });
          describe("sort_by and category are provided", () => {
            describe("category = euro game", () => {
              test.each([
                { column: "owner", category: "euro%20game" },
                { column: "title", category: "euro%20game" },
                { column: "review_id", category: "euro%20game" },
                { column: "category", category: "euro%20game" },
                { column: "review_img_url", category: "euro%20game" },
                { column: "created_at", category: "euro%20game" },
                { column: "review_votes", category: "euro%20game" },
                { column: "comment_count", category: "euro%20game" },
              ])(
                "Check sort_by=$column&category=$category",
                ({ column, category }) => {
                  return request(app)
                    .get(`/api/reviews?sort_by=${column}&category=${category}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(({ body: { reviews } }) => {
                      reviews.forEach((review) => {
                        expect(review).toMatchObject({
                          title: expect.any(String),
                          designer: expect.any(String),
                          owner: expect.any(String),
                          review_img_url: expect.any(String),
                          review_body: expect.any(String),
                          category: expect.any(String),
                          created_at: expect.any(String),
                          review_votes: expect.any(Number),
                          comment_count: expect.any(Number),
                        });
                      });

                      expect(reviews).toBeSortedBy(column, {
                        compare: descendingCompareFunc,
                      });
                    });
                }
              );
            });
            describe("category = social deduction", () => {
              test.each([
                { column: "owner", category: "social%20deduction" },
                { column: "title", category: "social%20deduction" },
                { column: "review_id", category: "social%20deduction" },
                { column: "category", category: "social%20deduction" },
                { column: "review_img_url", category: "social%20deduction" },
                { column: "created_at", category: "social%20deduction" },
                { column: "review_votes", category: "social%20deduction" },
                { column: "comment_count", category: "social%20deduction" },
              ])("Check sort_by=$column&category=$category", ({ column }) => {
                return request(app)
                  .get(`/api/reviews?sort_by=${column}&order=desc`)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then(({ body: { reviews } }) => {
                    reviews.forEach((review) => {
                      expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        review_votes: expect.any(Number),
                        comment_count: expect.any(Number),
                      });
                    });

                    expect(reviews).toBeSortedBy(column, {
                      compare: descendingCompareFunc,
                    });
                  });
              });
            });
            describe("category = dexterity", () => {
              test.each([
                { column: "owner", category: "dexterity" },
                { column: "title", category: "dexterity" },
                { column: "review_id", category: "dexterity" },
                { column: "category", category: "dexterity" },
                { column: "review_img_url", category: "dexterity" },
                { column: "created_at", category: "dexterity" },
                { column: "review_votes", category: "dexterity" },
                { column: "comment_count", category: "dexterity" },
              ])(
                "Check sort_by=$column&category=$category",
                ({ column, category }) => {
                  return request(app)
                    .get(`/api/reviews?sort_by=${column}&category=${category}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(({ body: { reviews } }) => {
                      reviews.forEach((review) => {
                        expect(review).toMatchObject({
                          title: expect.any(String),
                          designer: expect.any(String),
                          owner: expect.any(String),
                          review_img_url: expect.any(String),
                          review_body: expect.any(String),
                          category: expect.any(String),
                          created_at: expect.any(String),
                          review_votes: expect.any(Number),
                          comment_count: expect.any(Number),
                        });
                      });

                      expect(reviews).toBeSortedBy(column, {
                        compare: descendingCompareFunc,
                      });
                    });
                }
              );
            });
            describe(`category = children's games`, () => {
              test.each([
                { column: "owner", category: `children%27s%20games` },
                { column: "title", category: `children%27s%20games` },
                { column: "review_id", category: `children%27s%20games` },
                { column: "category", category: `children%27s%20games` },
                { column: "review_img_url", category: `children%27s%20games` },
                { column: "created_at", category: `children%27s%20games` },
                { column: "review_votes", category: `children%27s%20games` },
                { column: "comment_count", category: `children%27s%20games` },
              ])(
                "Check sort_by=$column&category=$category",
                ({ column, category }) => {
                  return request(app)
                    .get(`/api/reviews?sort_by=${column}&category=${category}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(({ body: { reviews } }) => {
                      reviews.forEach((review) => {
                        expect(review).toMatchObject({
                          title: expect.any(String),
                          designer: expect.any(String),
                          owner: expect.any(String),
                          review_img_url: expect.any(String),
                          review_body: expect.any(String),
                          category: expect.any(String),
                          created_at: expect.any(String),
                          review_votes: expect.any(Number),
                          comment_count: expect.any(Number),
                        });
                      });

                      expect(reviews).toBeSortedBy(column, {
                        compare: descendingCompareFunc,
                      });

                      // check category filtering
                      let decodedCategory = decodeURI(category);
                      const notTheseCategories = [
                        "euro game",
                        "social deduction",
                        "dexterity",
                        "children's games",
                      ].filter(
                        (categoryItem) => categoryItem !== decodedCategory
                      );

                      reviews.forEach((review) => {
                        notTheseCategories.forEach((notThisCategory) => {
                          expect(review.category).not.toBe(notThisCategory);
                        });
                      });
                    });
                }
              );
            });
          });
          describe("order and category are provided", () => {
            describe("order = desc", () => {
              test.each([
                { category: "euro+game" },
                { category: "social+deduction" },
                { category: "dexterity" },
                { category: "children%27s+games" },
              ])("Check order=desc&category=$category", ({ category }) => {
                return request(app)
                  .get(`/api/reviews?order=desc&category=${category}`)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then(({ body: { reviews } }) => {
                    reviews.forEach((review) => {
                      expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        review_votes: expect.any(Number),
                        comment_count: expect.any(Number),
                      });
                    });
                    // desc
                    expect(reviews).toBeSortedBy("created_at", {
                      compare: descendingCompareFunc,
                    });
                  });
              });
            });
            describe("order = asc", () => {
              test.each([
                { category: "euro%20game" },
                { category: "social%20deduction" },
                { category: "dexterity" },
                { category: "children%27s+games" },
              ])("Check order=asc&category=$category", ({ category }) => {
                return request(app)
                  .get(`/api/reviews?order=asc&category=${category}`)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then(({ body: { reviews } }) => {
                    reviews.forEach((review) => {
                      expect(review).toMatchObject({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        review_votes: expect.any(Number),
                        comment_count: expect.any(Number),
                      });
                    });
                    // asc
                    expect(reviews).toBeSortedBy("created_at", {
                      compare: ascendingCompareFunc,
                    });
                    // check every category value is $category
                    const categoryDecoded = decodeURI(category);
                    reviews.forEach((review) => {
                      expect(review.category).toBe(`${categoryDecoded}`);
                    });
                  });
              });
            });
          });
        });
        describe(" When all 3 query parameters are provided", () => {
          test.each([
            {
              name: "Test 1",
              sortByColumn: "owner",
              sortOrder: "asc",
              filterCategory: "euro%20game",
            },
            {
              name: "Test 2",
              sortByColumn: "review_votes",
              sortOrder: "asc",
              filterCategory: "social%20deduction",
            },
            {
              name: "Test 3",
              sortByColumn: "comment_count",
              sortOrder: "desc",
              filterCategory: "children%27s%20games",
            },
            {
              name: "Test 4",
              sortByColumn: "title",
              sortOrder: "desc",
              filterCategory: "dexterity",
            },
          ])(
            "$name: Check sort_by=$sortByColumn&order=$sortOrder&category=$filterCategory",
            ({ sortByColumn, sortOrder, filterCategory }) => {
              return request(app)
                .get(
                  `/api/reviews?sort_by=${sortByColumn}&order=${sortOrder}&category=${filterCategory}`
                )
                .expect("Content-Type", /json/)
                .expect(200)
                .then(({ body: { reviews } }) => {
                  //check object structure
                  reviews.forEach((review) => {
                    expect(review).toMatchObject({
                      title: expect.any(String),
                      designer: expect.any(String),
                      owner: expect.any(String),
                      review_img_url: expect.any(String),
                      review_body: expect.any(String),
                      category: expect.any(String),
                      created_at: expect.any(String),
                      review_votes: expect.any(Number),
                      comment_count: expect.any(Number),
                    });
                  });

                  // check sort order
                  const returnCompareFunc = (sortOrder) => {
                    if (sortOrder === "asc") {
                      return ascendingCompareFunc;
                    } else if (sortOrder === "desc") {
                      return descendingCompareFunc;
                    }
                  };
                  if (reviews.length > 0) {
                    expect(reviews).toBeSortedBy(sortByColumn, {
                      compare: returnCompareFunc(sortOrder),
                    });
                  }
                  // check category filtering
                  let decodedCategory = decodeURIComponent(filterCategory);
                  const notTheseCategories = [
                    "euro game",
                    "social deduction",
                    "dexterity",
                    "children's games",
                  ].filter((categoryItem) => categoryItem !== decodedCategory);

                  reviews.forEach((review) => {
                    notTheseCategories.forEach((notThisCategory) => {
                      expect(review.category).not.toBe(notThisCategory);
                    });
                  });
                });
            }
          );
        });
      });
      describe("Status 400", () => {
        test('Invalid "sort_by" query parameter provided (not any of the table columns)', () => {
          return request(app)
            .get("/api/reviews?sort_by=daffodil")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "400 Error Bad Request: invalid sort_by query parameter provided"
              );
            });
        });
        test(`Invalid "order" query parameter provided (not asc or desc)`, () => {
          return request(app)
            .get("/api/reviews?order=daffodil")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "400 Error Bad Request: invalid order query parameter provided"
              );
            });
        });
      });
      describe("Status 404", () => {
        test(`Category query parameter provided doesn't exist`, () => {
          return request(app)
            .get("/api/reviews?category=myInvalidCategory")
            .expect("Content-Type", /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "404 Error Not Found: category query parameter provided doesn't exist"
              );
            });
        });
      });
    });
  });
  describe("/api/reviews/review:id", () => {
    describe("GET request", () => {
      describe("Status 200", () => {
        test("When provided valid and existing review_id, returns review that has provided id", () => {
          return request(app)
            .get("/api/reviews/1")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { review } }) => {
              expect(review).toEqual({
                review_id: 1,
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: "2021-01-18T10:00:20.514Z",
                review_votes: 1,
                comment_count: 0,
              });
            });
        });
      });
      describe("Status 400", () => {
        test("Invalid review_id (not a number)", () => {
          return request(app)
            .get("/api/reviews/myInvalidStringInput")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Error Bad Request: invalid review_id");
            });
        });
      });
      describe("Status 404", () => {
        test(`Provided review_id that doesn't exist`, () => {
          return request(app)
            .get("/api/reviews/88")
            .expect("Content-Type", /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "404 Error Not Found: No review with the review_id provided was found"
              );
            });
        });
      });
    });
    describe("PATCH request", () => {
      describe(`Status 200`, () => {
        test('Increments review_votes by amount specified on "inc_votes" value of req body', () => {
          return request(app)
            .patch("/api/reviews/1/")
            .send({ inc_votes: 10 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { review } }) => {
              expect(review).toEqual({
                review_id: 1,
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: "2021-01-18T10:00:20.514Z",
                review_votes: 11,
                comment_count: 0,
              });
            });
        });
        test('Decrements review_votes by amount specified on "inc_votes" value of req body', () => {
          return request(app)
            .patch("/api/reviews/1/")
            .send({ inc_votes: -1 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { review } }) => {
              expect(review).toEqual({
                review_id: 1,
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: "2021-01-18T10:00:20.514Z",
                review_votes: 0,
                comment_count: 0,
              });
            });
        });
        test('Ignores extra key-value pairs provided on request body (besides "inc_votes"', () => {
          return request(app)
            .patch("/api/reviews/1/")
            .send({
              inc_votes: 5,
              extraKey: "extraValue",
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { review } }) => {
              expect(review).toEqual({
                review_id: 1,
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: "2021-01-18T10:00:20.514Z",
                review_votes: 6,
                comment_count: 0,
              });
            });
        });
      });
      describe("Status 400", () => {
        test("Invalid review_id (not a number)", () => {
          return request(app)
            .patch("/api/reviews/myInvalidStringInput")
            .send({ inc_votes: 10 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Error Bad Request: invalid review_id");
            });
        });
      });
      describe("Status 404", () => {
        test(`Provided review_id that doesn't exist`, () => {
          return request(app)
            .patch("/api/reviews/88")
            .send({ inc_votes: 10 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                `404 Error Not Found: No review with the review_id provided was found`
              );
            });
        });
      });
    });
  });
  describe("/api/reviews/review:id/comments", () => {
    describe("GET request", () => {
      describe("Status 200", () => {
        test("Returns array of all comments with specified a valid and existing review_id (if any comments exist for it)", () => {
          return request(app)
            .get("/api/reviews/2/comments")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { reviewComments } }) => {
              if (reviewComments.length > 0) {
                reviewComments.forEach((reviewComment) => {
                  expect(reviewComment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    comment_votes: expect.any(Number),
                    author: expect.any(String),
                    review_id: expect.any(Number),
                    created_at: expect.any(String),
                  });
                });
              }
            });
        });
        test("Returns empty array for review with no comments if review_id is valid and exists", () => {
          return request(app)
            .get("/api/reviews/1/comments")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { reviewComments } }) => {
              expect(reviewComments).toEqual([]);
            });
        });
      });
      describe("Status 400", () => {
        test("Invalid review_id (not a number)", () => {
          return request(app)
            .get("/api/reviews/myInvalidStringInput")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Error Bad Request: invalid review_id");
            });
        });
      });
      describe("Status 404", () => {
        test(`Provided review_id doesn't exist`, () => {
          return request(app)
            .get("/api/reviews/88/comments")
            .expect("Content-Type", /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                `404 Error Not Found: No review with the review_id provided was found`
              );
            });
        });
      });
    });
    describe("POST request", () => {
      describe("Status 201", () => {
        test("Provided valid and existing comment_id, and valid request body, adds new review comment", () => {
          return request(app)
            .post("/api/reviews/2/comments")
            .send({ username: "mallionaire", body: "Great review!" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .then(({ body: { newReviewComment } }) => {
              expect(newReviewComment.comment_id).toBe(7);
              expect(newReviewComment.body).toBe("Great review!");
              expect(newReviewComment.comment_votes).toBe(0);
              expect(newReviewComment.author).toBe("mallionaire");
              expect(newReviewComment.review_id).toBe(2);
              expect(typeof newReviewComment.created_at).toBe("string");
            });
        });
        test("Same as above, but provided extra information on request body. Ignores this extra information.", () => {
          return request(app)
            .post("/api/reviews/2/comments")
            .send({
              username: "mallionaire",
              body: "Great review!",
              extraKey: "myExtraInfo",
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .then(({ body: { newReviewComment } }) => {
              expect(newReviewComment.comment_id).toBe(7);
              expect(newReviewComment.body).toBe("Great review!");
              expect(newReviewComment.comment_votes).toBe(0);
              expect(newReviewComment.author).toBe("mallionaire");
              expect(newReviewComment.review_id).toBe(2);
              expect(typeof newReviewComment.created_at).toBe("string");
            });
        });
      });
      describe("Status 400", () => {
        test("Invalid review_id (not a number)", () => {
          return request(app)
            .post("/api/reviews/myInvalidStringInput/comments")
            .send({ username: "mallionaire", body: "Great review!" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(`400 Error Bad Request: invalid review_id`);
            });
        });
        test(`Request body does not include 'body' key or 'username' key`, () => {
          return request(app)
            .post("/api/reviews/2/comments")
            .send({})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(`400 Error Bad Request: request body missing 'body' key or 'username' key`);
            });
        })
      });
      describe("Status 404", () => {
        test(`Provided review_id doesn't exist`, () => {
          return request(app)
            .post("/api/reviews/88/comments")
            .send({ username: "mallionaire", body: "Great review!" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                `404 Error Not Found: No review with the review_id provided was found`
              );
            });
        });
        test(`Username provided in request body doesn't exist`, () => {
          return request(app)
            .post("/api/reviews/2/comments")
            .send({ username: "usernameDoesNotExist", body: "Great review!" })
            .expect("Content-Type", /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                `404 Error Not Found: No user with the username provided was found`
              );
            });
        });
      });
    });
  });
  // /api/comments
  describe("/api/comments/:comment_id", () => {
    describe("DELETE request", () => {
      test("Status 204 - When passed valid and existing comment_id, deletes entry. No response body.", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          });
      });
      test("Status 400 - Invalid comment_id (not a number)", () => {
        return request(app)
          .delete("/api/comments/myInvalidStringInput")
          .expect("Content-Type", /json/)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("400 Error Bad Request: invalid comment_id");
          });
      });
      test("Status 404 - No comment with this comment_id exists", () => {
        return request(app)
          .delete("/api/comments/88")
          .expect("Content-Type", /json/)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "404 Error Not Found: No comment with the provided comment_id was found"
            );
          });
      });
    });
    describe("PATCH request", () => {
      describe(`Status 200`, () => {
        test('Increments comment_votes by the amount specified by "inc_votes" value in request body', () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 3 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { updatedComment } }) => {
              expect(updatedComment).toEqual({
                comment_id: 1,
                body: "I loved this game too!",
                comment_votes: 19,
                author: "bainesface",
                review_id: 2,
                created_at: "2017-11-22T12:43:33.389Z",
              });
            });
        });
        test('Decrements comment_votes by the amount specified by "inc_votes" value in request body', () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: -2 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { updatedComment } }) => {
              expect(updatedComment).toEqual({
                comment_id: 2,
                body: "My dog loved this game too!",
                comment_votes: 11,
                author: "mallionaire",
                review_id: 3,
                created_at: "2021-01-18T10:09:05.410Z",
              });
            });
        });
        test("Works as normal when extra key-value pairs are included in request body", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: 2, extra_key: ["some", "more", "information"] })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { updatedComment } }) => {
              expect(updatedComment).toEqual({
                comment_id: 2,
                body: "My dog loved this game too!",
                comment_votes: 15,
                author: "mallionaire",
                review_id: 3,
                created_at: "2021-01-18T10:09:05.410Z",
              });
            });
        });
      });
      describe("Status 404", () => {
        test("No comments with comment_id exists", () => {
          return request(app)
            .patch("/api/comments/88")
            .send({ inc_votes: 1 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "404 Error Not Found: No comment with the provided comment_id was found"
              );
            });
        });
      });
      describe("Status 400", () => {
        test("Invalid comment_id (not a number)", () => {
          return request(app)
            .patch("/api/comments/notACommentId")
            .send({ inc_votes: 1 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Error Bad Request: invalid comment_id");
            });
        });
        test(`No 'inc_votes' key on request body`, () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ increase_votes: 1 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "400 Error Bad Request: Missing 'inc_votes' in request body"
              );
            });
        });
        test(`Invalid 'inc_votes' value on request body (not a number) `, () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: "notANumber" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                `400 Error Bad Request: Invalid 'inc_votes' value in request body`
              );
            });
        });
      });
    });
  });
  // /api/users
  describe("/api/users", () => {
    describe("GET request", () => {
      describe("Status 200", () => {
        test('returns an array of all user objects, attached to the "users" key', () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
              users.forEach((user) => {
                expect(user).toMatchObject({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                });
              });
              expect(users).toHaveLength(4);
            });
        });
      });
    });
  });
  describe("/api/users/:username", () => {
    describe("GET request", () => {
      describe("Status 200", () => {
        test('Returns the user with the provided "username"', () => {
          return request(app)
            .get("/api/users/mallionaire")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).toEqual({
                username: "mallionaire",
                name: "haz",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              });
            });
        });
      });
      describe("Status 404", () => {
        test(`Username doesn't exist in users table`, () => {
          return request(app)
            .get("/api/users/notAUser")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                `404 Error Not Found: No user with the username provided was found`
              );
            });
        });
      });
    });
  });
});
