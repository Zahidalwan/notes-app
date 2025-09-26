import exprees from "express";
import { getAllNoteHandlers } from "../Handlers/notesHandler.js";
import { getNoteByIdHandler } from "../Handlers/notesHandler.js";
import { addNoteHandler } from "../Handlers/notesHandler.js";
import { updateNoteByIdHandler } from "../Handlers/notesHandler.js";
import { deleteNoteByIdHandler } from "../Handlers/notesHandler.js";

const noteRouter = exprees.Router();

noteRouter.get("/notes", getAllNoteHandlers);
noteRouter.put("/notes/:id", updateNoteByIdHandler);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNoteByIdHandler);
noteRouter.delete("/notes/:id", deleteNoteByIdHandler);

export default noteRouter;
