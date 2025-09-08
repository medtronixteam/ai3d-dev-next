import React, { useState, useEffect, useRef } from "react";
import "./chatBox.css";
import { LuSend } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import Login from "./Login";
import axios from "axios";
import robot from "../../../assets/images/robot.png";
import chatlogo from "../../../assets/images/logo2.png";

const Chatbox = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const chatboxBodyRef = useRef(null);

  const toggleChat = () => {
    setShow(!show);
    setShowWelcome(false); // Hide welcome message when chatbox is opened
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        timestamp: new Date().toISOString(),
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      setLoading(true);

      try {
        console.log("Making first API call");

        const { name, email } = userData;

        await axios.post("https://medtronix.world/api/chat/messages", {
          name: name || "",
          email: email || "",
          message: message,
        });

        const response = await axios.post(
          "https://medtronix.world/api/chat/messages/list",
          {
            name: name || "",
            email: email || "",
            payload: message,
          }
        );

        console.log("Second API call response:", response.data);
        const responseData = response.data;

        if (
          Array.isArray(responseData.message) &&
          responseData.message.length > 0
        ) {
          const apiMessage = responseData.message[0]?.message;

          if (apiMessage) {
            const apiReply = {
              text: apiMessage,
              timestamp: new Date().toISOString(),
              sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, apiReply]);
          } else {
            console.error("No message found in API response");
          }
        } else {
          console.error("Response does not contain an array of messages");
        }
      } catch (error) {
        console.error(
          "Error during API calls:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (chatboxBodyRef.current) {
      chatboxBodyRef.current.scrollTop = chatboxBodyRef.current.scrollHeight;
    }

    if (messages.length === 0 && isLoggedIn && userData) {
      const welcomeMessage = (
        <span>
          Welcome{" "}
          <strong style={{ color: "#c72f81", fontWeight: "900" }}>
            {userData.name}
          </strong>{" "}
          ! how can i assist you today?
        </span>
      );
      const welcome = {
        text: welcomeMessage,
        timestamp: new Date().toISOString(),
        sender: "bot",
      };
      setMessages([welcome]);
    }
  }, [messages, isLoggedIn, userData]);

  return (
    <>
      {showWelcome && (
        <div className="welcome-message">
          Welcome! how can I assist you?
          <span className="close-welcome" onClick={() => setShowWelcome(false)}>
            &times;
          </span>
        </div>
      )}
      <span className="chat-icon" onClick={toggleChat}>
        <img src={robot} className="img-fluid" alt="Chat Icon" />
      </span>

      {show && (
        <div className="chatbox">
          <div className="chatbox-header">
            <div className="d-flex align-items-center">
              <img
                src={chatlogo}
                alt="Chat Logo"
                className="img-fluid"
                style={{ width: 120, marginRight: 10 }}
              />
              <h5 className="pink-clr m-0">
                {/* <b>AI 3D</b>{" "} */}
                <span style={{ fontSize: "12px", color: "white" }}>
                  SCANNING SOLUTION
                </span>
              </h5>
            </div>
            <IoMdClose className="close-icon" onClick={toggleChat} />
          </div>
          <hr id="hr" />
          {!isLoggedIn ? (
            <Login
              onLogin={(status, data) => {
                setIsLoggedIn(status);
                setUserData(data);
              }}
            />
          ) : (
            <>
              <div className="chatbox-body" ref={chatboxBodyRef}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chatbox-message ${
                      msg.sender === "user" ? "user" : "bot"
                    }`}>
                    {typeof msg.text === "string" ? msg.text : msg.text}
                  </div>
                ))}
                {loading && <div className="loader">...</div>}{" "}
                {/* Dot loader */}
              </div>
              <div className="chatbox-footer">
                <input
                  type="text"
                  name="text"
                  className="input"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <span className="send-icon" onClick={handleSendMessage}>
                  <LuSend />
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbox;
