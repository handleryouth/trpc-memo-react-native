import express from "express";
import path from "path";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createMemo } from "./router";

const port = process.env.PORT || 5001;

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: createMemo,
    createContext: () => null,
  })
);

app.get("/", (_req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
