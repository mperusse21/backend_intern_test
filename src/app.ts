import express from "express";
import { yogaPublicRouter } from "./graphql/schema";

const app = express();

app.use("/graphql", yogaPublicRouter);

app.get("/", (req, res) => {
  // redirect to the graphql playground
  res.redirect("/graphql");
});

export default app;