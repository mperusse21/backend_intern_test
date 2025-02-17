import { assert, expect } from "chai";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/graphql/schema";
import sinon from "sinon";

describe("Todo API tests", () => {
  // Create the stubs before starting the tests
  before(() => {
    const findManyResult = [
      {
        id: "1",
        title: "Todo 1",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: null,
      },
      {
        id: "2",
        title: "Todo 2",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: null,
      },
    ];

    const singleTodo = {
      id: "1234",
      title: "test",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date("2025-02-16"),
    };

    // withArgs is not working for stubs, resolves to the same value no matter the input.
    prisma.todo.findUnique = sinon
      .stub()
      .withArgs({ where: { id: "1234" } })
      .resolves(singleTodo);
    prisma.todo.findMany = sinon.stub().resolves(findManyResult);
    prisma.todo.create = sinon
      .stub()
      .withArgs({ input: { title: "test todo", dueDate: "2025-02-16" } })
      .resolves(singleTodo);
  });

  // Reset all stubs after tests finish.
  after(() => {
    sinon.restore();
  });

  describe("Todo Query tests", () => {
    it("Should respond with unique Todo and status 200", async () => {
      const response = await request(app)
        .post("/graphql")
        .send({ query: `query { todo(id: "1234"){ id title }}` });

      expect(response.status).to.be.equal(200);
      expect(response.body.data.todo.id).to.equal("1234");
      expect(response.body.data.todo.title).to.equal("test");
    });

    it("Should respond with array of Todos and status 200", async () => {
      const response = await request(app).post("/graphql").send({
        query: `query { todos{ id title completed createdAt updatedAt dueDate }}`,
      });

      expect(response.status).to.be.equal(200);
      assert.isArray(response.body.data.todos);
      expect(response.body.data.todos).to.have.lengthOf(2);
      expect(Object.keys(response.body.data.todos[0])).to.have.lengthOf(6);
    });

    it("Should respond with error message when two order bys applied", async () => {
      const response = await request(app).post("/graphql").send({
        query: `query { todos(sortBy: {sortByDueDate: asc, sortByCreatedAt: desc}){ id title completed createdAt updatedAt dueDate }}`,
      });

      const error = response.body.errors[0];
      expect(error.message).to.equal(
        "Unable to order by multiple criteria. Please select only one"
      );
    });

    it("Should respond with error message when skip is negative", async () => {
      const response = await request(app).post("/graphql").send({
        query: `query { todos(skip: -1){ id title completed createdAt updatedAt dueDate }}`,
      });

      const error = response.body.errors[0];
      expect(error.message).to.equal(
        "Skip cannot be negative. Please provide an integer of zero or higher"
      );
    });
  });

  describe("Todo Mutation tests", () => {
    it("Should respond with created Todo and status 200", async () => {
      const response = await request(app).post("/graphql").send({
        query: `mutation { createTodo(input:{title: "test todo", dueDate:"2025-02-16"}){ id title completed createdAt updatedAt dueDate }}`,
      });

      const expectedDate = new Date("2025-02-16").toString();
      expect(response.status).to.be.equal(200);
      expect(response.body.data.createTodo.title).to.equal("test");
      expect(response.body.data.createTodo.id).to.equal("1234");
      expect(response.body.data.createTodo.dueDate).to.equal(expectedDate);
    });

    it("Should respond with error message when trying to create todo with empty title", async () => {
      const response = await request(app).post("/graphql").send({
        query: `mutation { createTodo(input:{title: "", dueDate:"2023-01-01"}){ id title completed createdAt updatedAt dueDate }}`,
      });

      const error = response.body.errors[0];
      expect(error.message).to.equal("Cannot create Todo with an empty title");
    });

    it("Should respond with error message when trying to update todo with no data", async () => {
      const response = await request(app).post("/graphql").send({
        query: `mutation { updateTodo(input:{id: "1234"}){ id title completed createdAt updatedAt dueDate }}`,
      });

      const error = response.body.errors[0];
      expect(error.message).to.equal(
        "Please provide a title and/or completion status to update"
      );
    });

    it("Should respond with error message when trying to update todo with empty title", async () => {
      const response = await request(app).post("/graphql").send({
        query: `mutation { updateTodo(input:{id: "1234", title: ""}){ id title completed createdAt updatedAt dueDate }}`,
      });

      const error = response.body.errors[0];
      expect(error.message).to.equal("Cannot update Todo with an empty title");
    });
  });
});
