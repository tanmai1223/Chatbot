import { useEffect, useRef, useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import {
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";

import style from "../Style/message.module.css";

function Message({ messages, isTyping }) {
  const chatRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [messages, isTyping]);

  const copyText = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  

  return (
   <div
  ref={chatRef}
  className={style.chatBody}
>
    {messages.length === 0 ? (
      <div className={style.welcome}>
        <div className={style.welcomeIcon}>🤖</div>

        <h2>Hello!</h2>

        <p>How may I help you today?</p>
      </div>
    ) : (
      <>
      {messages.map((m) => (
        <div
          key={m._id}
          className={`${style.messageRow} ${
            m.role === "user" ? style.user : style.assistant
          }`}
        >
          {/* Assistant Avatar */}
          {m.role === "assistant" && (
            <div className={style.avatar}>🤖</div>
          )}

          {/* Assistant Message */}
          {m.role === "assistant" ? (
            <div className={style.messageContainer}>
              <div className={style.messageBubble}>
                {m.text}
              </div>

              <div className={style.actionRow}>
                <button
                  className={style.iconBtn}
                  onClick={() => copyText(m._id, m.text)}
                  title="Copy"
                >
                  {copiedId === m._id ? (
                    <FiCheck />
                  ) : (
                    <FiCopy />
                  )}
                </button>

                <button
                  className={style.iconBtn}
                  title="Like"
                  onClick={() =>
                    setFeedback((prev) => ({
                      ...prev,
                      [m._id]:
                        prev[m._id] === "like"
                          ? null
                          : "like",
                    }))
                  }
                >
                  {feedback[m._id] === "like" ? (
                    <AiFillLike />
                  ) : (
                    <FiThumbsUp />
                  )}
                </button>

                <button
                  className={style.iconBtn}
                  title="Dislike"
                  onClick={() =>
                    setFeedback((prev) => ({
                      ...prev,
                      [m._id]:
                        prev[m._id] === "dislike"
                          ? null
                          : "dislike",
                    }))
                  }
                >
                  {feedback[m._id] === "dislike" ? (
                    <AiFillDislike />
                  ) : (
                    <FiThumbsDown />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* User Message */}
              <div className={style.messageBubble}>
                {m.text}
              </div>

              {/* User Avatar */}
              <div className={style.avatar}>👤</div>
            </>
          )}
        </div>
      ))}
      {isTyping && (
  <div className={`${style.messageRow} ${style.assistant}`}>
    <div className={style.avatar}>🤖</div>

    <div className={style.typingBubble}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
)}

    </>
  )}

      
      
   
  </div>
)
}

export default Message;