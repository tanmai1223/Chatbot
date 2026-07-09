import { generateTitle, main } from "../geminiAPI.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";

export const postPrompt = async (req, res) => {
  try {
    let { chatId, chat } = req.body;

    if (!chat) {
      return res.status(400).json({
        success: false,
        message: "Prompt can't be empty",
      });
    }

    // Create new chat if needed
    if (!chatId) {
      const newChat = await Chat.create({
        title: "New Chat",
      });

      chatId = newChat._id;
    }

    // Save user message
    await Message.create({
      chatId,
      text: chat,
      role: "user",
    });

    // Fetch history
    const history = await Message.find({ chatId }).sort({
      createdAt: 1,
    });

    // Get Gemini stream
    const stream = await main(history);

    // Streaming headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Chat-Id", chatId.toString());

    let finalResponse = "";

    for await (const chunk of stream) {
      const text = chunk.text;

      if (text) {
        finalResponse += text;
        res.write(text);
      }
    }

    // Save assistant response after streaming completes
    await Message.create({
      chatId,
      role: "assistant",
      text: finalResponse,
    });

    const title = await generateTitle(chat, finalResponse);

    await Chat.findByIdAndUpdate(chatId, {
      title,
    });

    res.end();
  } catch (err) {
    console.error(err);

    let statusCode = 500;
    let message = "Something went wrong. Please try again.";

    // Gemini quota exceeded
    if (err.status === 429) {
      statusCode = 429;
      message =
        "You've reached the daily free API limit. Please try again tomorrow.";
    }

    // Gemini overloaded
    else if (err.status === 503) {
      statusCode = 503;
      message =
        "The AI service is currently busy. Please try again in a few moments.";
    }

    // Bad request
    else if (err.status === 400) {
      statusCode = 400;
      message =
        "Your request couldn't be processed. Please try a different question.";
    }

    if (!res.headersSent) {
      return res.status(statusCode).json({
        success: false,
        message,
      });
    }

    // If streaming had already started
    res.write(`\n\n[ERROR] ${message}`);
    res.end();
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.id,
    }).sort({ createdAt: 1 });
    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Could not fetch prompt",
      });
    }
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: chats,
    });
  } catch (err) {
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Could not fetch chats",
      });
    }
  }
};

export const renameChat=async(req,res)=>{
  try{
    const id=req.params.id;
    const {title}=req.body;

    const chat=await Chat.findById(id);

    if(!chat){
      return res.status(404).json({message: "Chat not found" })
    }

    if(!title){
      return res.status(400).json({message: "Flied cant be empty" })
    }

    chat.title=title;
    await chat.save();
    res.status(200).json({ message: "Title updated", data: chat });

  }catch (err) {
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Could not fetch chats",
      });
    }
  }
}

export const deleteChat=async(req,res)=>{
  try{
    const id=req.params.id;
    const chat=await Chat.findById(id)

    if(!chat){
      return res.status(404).json({message:"Chat cant be found"})
    }

    await Chat.findByIdAndDelete(id);
    res.status(200).json({ message: "Chat deleted", data: chat })

  }catch (err) {
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Could not fetch chats",
      });
    }
  }
}
