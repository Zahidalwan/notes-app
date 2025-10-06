import express from "express";
import { testConnection } from "./config/db.js";
import hello_Router from "./Routers/Router.js";
import noteRouter from "./Routers/notesRouter.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

app.use(hello_Router);
app.use(noteRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  testConnection();
});
