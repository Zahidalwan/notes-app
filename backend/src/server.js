import express from "express";
import { testConnection } from "./config/db.js";
import hello_Router from "./Routers/Router.js";

const app = express();

const PORT = 3000;

app.use("/", hello_Router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  testConnection();
});
