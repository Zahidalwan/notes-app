import exprees from "express";
import { getAllNoteHandlers } from "../Handlers/notesHandler.js";
import { getNoteByIdHandler } from "../Handlers/notesHandler.js";
import { addNoteHandler } from "../Handlers/notesHandler.js";

const noteRouter = exprees.Router();

noteRouter.get("/notes", getAllNoteHandlers);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNoteByIdHandler);

export default noteRouter;
