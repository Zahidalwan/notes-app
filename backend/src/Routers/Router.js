import express from "express";
import { sayHello } from "../Handlers/Handler.js";

const hello_Router = express.Router();

hello_Router.get("/", sayHello);

export default hello_Router;
