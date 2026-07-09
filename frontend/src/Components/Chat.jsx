import { useEffect, useRef, useState } from "react";
import style from "../Style/chat.module.css";
import Message from "./Message";
import Sidebar from "./Sidebar";
import DeleteModal from "./DeleteModal";
import { FiMenu } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

function Chat() {
  const [chat, setChat] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const textareaRef = useRef(null);
  // Fetch messages
  const fetchMessages = async (id) => {
    if (!id) {
      setMessages([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}`);
      const data = await res.json();
      setMessages(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chats`);
      const data = await res.json();
      setChats(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Load last opened chat
  useEffect(() => {
    const savedChatId = sessionStorage.getItem("chatId");
    if (savedChatId) {
      setChatId(savedChatId);
    }
  }, []);

  // Whenever chat changes, load its messages
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chat.trim()) return;

    const userText = chat;

    setChat("");

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "58px";
    }

    setLoading(true);

    const userMessage = {
      _id: Date.now(),
      role: "user",
      text: userText,
    };

    const assistantId = Date.now() + 1;

    // Show only the user message initially
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${API_URL}/api/promptPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat: userText,
          chatId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.message);
      }

      const returnedChatId = response.headers.get("X-Chat-Id");

      let currentChatId = chatId;

      if (!chatId && returnedChatId) {
        currentChatId = returnedChatId;
      }

      if (!response.body) {
        throw new Error("No response body.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";
      let assistantCreated = false;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        fullText += chunk;

        // First chunk received
        if (!assistantCreated) {
          assistantCreated = true;

          // Hide typing indicator
          setLoading(false);

          setMessages((prev) => [
            ...prev,
            {
              _id: assistantId,
              role: "assistant",
              text: fullText,
            },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === assistantId
                ? {
                    ...msg,
                    text: fullText,
                  }
                : msg,
            ),
          );
        }
      }

      // Refresh sidebar if it's a new chat
      if (!chatId && returnedChatId) {
        await fetchChats();

        setChatId(currentChatId);
        sessionStorage.setItem("chatId", currentChatId);
      }

      // Sync messages from DB
      await fetchMessages(currentChatId);
    } catch (err) {
      console.error(err);

      let errorMessage = "Something went wrong. Please try again.";

      // No internet / backend not reachable
      if (err.name === "TypeError") {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection or try again later.";
      }

      // Backend sent a custom error message
      else if (err.message) {
        errorMessage = err.message;
      }

      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          _id: assistantId,
          role: "assistant",
          text: `⚠️ ${errorMessage}`,
        },
      ]);
    } finally {
      // Ensure typing indicator is hidden
      setLoading(false);
    }
  };
  const handleNewChat = async () => {
  sessionStorage.removeItem("chatId");
  setChatId(null);
  setMessages([]);
  setChat("");

  // Close sidebar on mobile
  setSidebarOpen(false);

  await fetchChats();
};

  const handleSelectChat = (id) => {
    setChatId(id);
    sessionStorage.setItem("chatId", id);
  };

  const renameChat = async (id, title) => {
    try {
      const res = await fetch(`${API_URL}/api/rename/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      });

      if (!res.ok) return;

      setChats((prev) =>
        prev.map((chat) => (chat._id === id ? { ...chat, title } : chat)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteChat = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) return;

      setChats((prev) => prev.filter((chat) => chat._id !== id));

      // If deleted chat is currently open
      if (chatId === id) {
        setChatId(null);
        setMessages([]);
        sessionStorage.removeItem("chatId");
      }

      setDeleteModal(false);
      setSelectedChat(null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={style.container}>
      <Sidebar
  chats={chats}
  handleNewChat={handleNewChat}
  onSelectChat={(id) => {
    handleSelectChat(id);
    setSidebarOpen(false);
  }}
  renameChat={renameChat}
  sidebarOpen={sidebarOpen}
  onDeleteClick={(chat) => {
    setSelectedChat(chat);
    setDeleteModal(true);
    setSidebarOpen(false);
  }}
/>
{sidebarOpen && (
  <div
    className={style.overlay}
    onClick={() => setSidebarOpen(false)}
  />
)}
      <main className={style.main}>
        <div className={style.header}>

    <button
        className={style.menuBtn}
        onClick={() => setSidebarOpen(true)}
    >
        <FiMenu />
    </button>

    <h2>AI Chatbot</h2>

</div>
        <div className={style.messages}>
          <Message messages={messages} isTyping={loading} />
        </div>

        <form className={style.inputArea}>
          <textarea
            ref={textareaRef}
            value={chat}
            onChange={(e) => {
              setChat(e.target.value);

              // Auto-grow
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask anything..."
            rows={1}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!chat.trim() || loading}
          >
            {loading ? "Generating..." : "Send"}
          </button>
        </form>
      </main>
      {deleteModal && (
  <DeleteModal
    chat={selectedChat}
    onCancel={() => {
      setDeleteModal(false);
      setSelectedChat(null);
    }}
    onDelete={deleteChat}
  />
)}
    </div>
  );
}

export default Chat;
