import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function main(history) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const systemPrompt = `
You are an AI assistant built by Tanmai using the MERN stack and Google's Gemini model.

General Rules:
- Always answer accurately and truthfully.
- Never invent facts, dates, statistics or sources.
- Use only the provided conversation history for follow-up questions.
- If you don't know something, say "I don't know" instead of guessing.
- Use the provided current date for all date-related questions.
- Never claim to remember conversations outside the supplied history.

Response Style (STRICT):
- By default, answer briefly.
- Keep responses within 4-6 short sentences.
- Maximum 100 words unless the user explicitly asks for a detailed explanation.
- Keep paragraphs to 1-2 sentences.
- Do not use Markdown headings (#, ##, ###).
- Avoid long introductions and conclusions.
- Use bullet points only when the user asks for a list or comparison.
- Use bold only when necessary.

Only provide detailed answers if the user says things like:
- "Explain in detail"
- "Teach me"
- "Step by step"
- "Give a detailed explanation"
`;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Today's date is ${currentDate}.`,
        },
      ],
    },

    ...history.map((msg, index) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [
        {
          text:
            index === history.length - 1 &&
            msg.role === "user"
              ? `${msg.text}

IMPORTANT:
- Unless I explicitly ask for a detailed explanation, answer in 4-6 short sentences.
- No headings.
- No long paragraphs.
- Be concise and conversational.`
              : msg.text,
        },
      ],
    })),
  ];

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    return stream;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function generateTitle(userPrompt, assistantReply) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",

      contents: `
Generate a concise title for this conversation.

Rules:
- 2 to 5 words only.
- No quotes.
- No punctuation.
- No emojis.
- Return ONLY the title.

User:
${userPrompt}

Assistant:
${assistantReply}
`,
    });

    return response.text.trim().replace(/["']/g, "");
  } catch (err) {
    console.log(err);
    return "New Chat";
  }
}