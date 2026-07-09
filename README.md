# 🤖 AI Chatbot (MERN Stack)

An AI-powered chatbot built using the MERN Stack and the Google Gemini API. The application allows users to create multiple conversations, interact with an AI assistant in real-time through streaming responses, and manage chat history with a clean, responsive interface.

## 🚀 Live Demo

**Frontend:** [https://your-netlify-url.netlify.app](https://chatbotmer.netlify.app/)

**Backend:** [https://your-render-url.onrender.com](https://chatbot-87ar.onrender.com)

---

## 📸 Screenshots

> Add screenshots of:
- <img width="1920" height="881" alt="image" src="https://github.com/user-attachments/assets/6ecdc1df-32c6-4b8f-a72b-edcbc78240be" />

- <img width="1479" height="877" alt="image" src="https://github.com/user-attachments/assets/da176f8f-83e1-4b7a-91c3-5f51792bbc28" />

- <img width="437" height="877" alt="image" src="https://github.com/user-attachments/assets/f3835243-265b-41d8-a9b7-094836f038c8" />

- <img width="362" height="740" alt="image" src="https://github.com/user-attachments/assets/dfd1646c-f1c7-4d8c-8205-228cffa9be8d" />


---

## ✨ Features

- 💬 Real-time AI responses using Google Gemini API
- ⚡ Streaming responses for a smooth chat experience
- 📝 Automatic chat title generation
- 📂 Multiple chat sessions
- ✏️ Rename existing chats
- 🗑️ Delete chats with confirmation modal
- 📋 Copy AI responses
- 👍 Like / 👎 Dislike responses (UI)
- ⌨️ Enter to send, Shift + Enter for new line
- ⏳ Typing indicator while AI is generating
- 📱 Fully responsive design
- 🍔 Mobile hamburger navigation
- 🔄 Session persistence during page refresh
- ⚠️ User-friendly error handling
- 🐳 Docker support
- 🔄 GitHub Actions CI

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- CSS Modules
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### AI
- Google Gemini API

### DevOps
- Docker
- Docker Compose
- GitHub Actions

---

## 📁 Project Structure

```
AI-Chatbot
│
├── chatbot        # Backend
│
├── frontend       # React Frontend
│
├── docker-compose.yaml
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone [https://github.com/yourusername/your-repo.git](https://github.com/tanmai1223/Chatbot)
cd your-repo
```

### Backend

```bash
cd chatbot
npm install
```

Create a `.env` file

```env
PORT=3000
MONGO_URI=YOUR_MONGODB_URI
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Start backend

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env`

```env
VITE_API_URL=http://localhost:3000
```

Run

```bash
npm run dev
```

---

## 🐳 Docker

Build and run the application

```bash
docker compose up --build
```

Stop containers

```bash
docker compose down
```

---

## 🔄 GitHub Actions

A CI workflow automatically:

- Installs dependencies
- Builds the React application
- Runs on every Push and Pull Request

---

## 📌 Future Improvements

- Markdown rendering
- Syntax highlighting
- Conversation search
- Voice input
- Image upload support
- Regenerate response
- Export chat history

---

## ⚠️ Limitations

- Uses the Google Gemini free tier.
- Response quality depends on the selected model.
- Internet search is **not** implemented.
- The chatbot answers only based on the AI model and does not browse the web.

---

## 👩‍💻 Author

**Tanmai**

GitHub: [https://github.com/yourusername](http://github.com/tanmai1223)

LinkedIn: [https://linkedin.com/in/yourprofile](http://linkedin.com/in/htanmai)
