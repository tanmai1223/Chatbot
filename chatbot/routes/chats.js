import { Router } from "express";
import {
  deleteChat,
  getChats,
  getMessages,
  postPrompt,
  renameChat,
} from "../controllers/chatting.js";
const route = Router();

route.post("/promptPost", postPrompt);
route.get("/chats", getChats);
route.patch("/rename/:id", renameChat);
route.delete("/delete/:id", deleteChat);
route.get("/messages/:id", getMessages);

export default route;
