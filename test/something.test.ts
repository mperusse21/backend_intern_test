import { expect } from "chai";
import request from "supertest";
import app from "../src/app";

describe("Something type api tests", () => {
  it("Should respond with hello world status 200", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({ query: "query { hello }" });

    expect(response.status).to.be.equal(200);
    expect(response.body.data).to.deep.equal({
      hello: "world",
    });
  });
});
