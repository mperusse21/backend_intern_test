import { expect } from "chai";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/graphql/schema";
import sinon from "sinon";

describe("Something API tests", () => {
  before(() => {
    const createSomethingResult = {
      id: "1234",
      name: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // When I tried using 'prismaCreateStub = sinon.stub(prisma.something, "create")' it was still adding to the db.
    // Found I needed to stub it directly for it to work:
    // https://medium.com/@wendryo.sales/efficient-mocking-of-prismaclient-a-step-by-step-guide-to-mocking-the-prismaclient-for-effective-997d49a9208f
    prisma.something.create = sinon
      .stub()
      .withArgs({ input: { name: "test" } })
      .resolves(createSomethingResult);
  });

  // Reset all stubs after tests finish.
  after(() => {
    sinon.restore();
  });

  it("Should respond with hello world status 200", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({ query: "query { hello }" });
      
    expect(response.status).to.be.equal(200);
    expect(response.body.data).to.deep.equal({ hello: "world" });
  });

  it("Should respond with created Something and status 200", async () => {
    const response = await request(app).post("/graphql").send({
      query: `mutation { createSomething ( input: {name: "test"} ){ name id } }`,
    });

    const createdSomething = response.body.data.createSomething;

    expect(response.status).to.be.equal(200);
    expect(createdSomething.id).to.equal("1234");
    expect(createdSomething.name).to.equal("test");
  });
});
