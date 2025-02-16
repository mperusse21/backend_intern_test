import { expect } from "chai";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/graphql/schema";
import sinon from "sinon";

describe("Todo API query tests", () => {
  // Reset all stubs after tests finish.
  after(() => {
    sinon.restore();
  });

  it("Should respond with unique Todo and status 200", async () => {
    const findUniqueResult = {
      id: "1234",
      title: "test",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
    };

    prisma.todo.findUnique = sinon
      .stub()
      .withArgs({ id: "1234" })
      .resolves(findUniqueResult);

    const response = await request(app)
      .post("/graphql")
      .send({ query: `query { todo(id: "1234"){ id title }}` });

    expect(response.status).to.be.equal(200);
    expect(response.body.data.todo.id).to.equal("1234");
    expect(response.body.data.todo.title).to.equal("test");
  });
});
