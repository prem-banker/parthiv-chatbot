import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Predefined responses for different scenarios
  const scenarios = {
    ankle: {
      diagnosis:
        "Based on your description of falling on ice and ankle pain, this could be an ankle sprain. The symptoms suggest a possible Grade 1 or 2 sprain, which involves stretching or partial tearing of the ankle ligaments.",
      treatment:
        "Recommended treatment:\n• R.I.C.E method (Rest, Ice, Compression, Elevation)\n• Over-the-counter pain relievers\n• Avoid putting weight on the affected foot\n• Use an ankle brace or wrap for support",
      doctor: "Dr. Sarah Anderson",
      specialty: "Orthopedic Specialist",
    },
    dental: {
      diagnosis:
        "Your symptoms indicate wisdom tooth impaction and possible temporomandibular joint (TMJ) inflammation. The pain in both your wisdom teeth and jaw suggests the teeth might be growing at an awkward angle, putting pressure on your jaw and surrounding teeth.",
      treatment:
        "Recommended treatment:\n• Over-the-counter pain relievers\n• Warm salt water rinses\n• Soft food diet\n• Ice pack for jaw pain\n• Avoid hard or chewy foods",
      doctor: "Dr. Michael Chen",
      specialty: "Dental Surgeon",
    },
  };

  const detectScenario = (text) => {
    const ankleKeywords = ["ankle", "leg", "fell", "ice", "foot"];
    const dentalKeywords = ["teeth", "tooth", "jaw", "wisdom", "dental"];

    text = text.toLowerCase();
    if (ankleKeywords.some((keyword) => text.includes(keyword))) {
      return "ankle";
    } else if (dentalKeywords.some((keyword) => text.includes(keyword))) {
      return "dental";
    }
    return null;
  };

  const generateResponse = (scenario) => {
    const response = scenarios[scenario];
    return `${response.diagnosis}\n\n${response.treatment}\n\nI recommend consulting ${response.doctor}, ${response.specialty}. Would you like me to help schedule an appointment?`;
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      // Detect scenario and generate response
      const scenario = detectScenario(input);
      setTimeout(() => {
        if (scenario) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: generateResponse(scenario), sender: "bot" },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text:
                "I'm sorry, could you please provide more details about your health concern?",
              sender: "bot",
            },
          ]);
        }
      }, 1000);
    }
  };

  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button className="fab" onClick={toggleChat}>
        Chat
      </button>
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-contact">
              <div className="contact-avatar">HA</div>
              <div className="contact-name">HealthAI</div>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text.split("\n").map((line, i) => (
                  <p key={i} style={{ margin: "4px 0" }}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your symptoms..."
              className="chat-input"
            />
            <button className="send-button" onClick={handleSend}>
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
