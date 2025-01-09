import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [appointmentState, setAppointmentState] = useState({
    isActive: false,
    currentQuestion: null,
    doctor: null,
    specialty: null,
    patientInfo: {
      name: null,
      phone: null,
      date: null,
      time: null,
    },
  });

  // Questions sequence for appointment
  const appointmentQuestions = {
    name: "Could you please provide your full name?",
    phone: "What's the best phone number to reach you?",
    date: "What date would you prefer? (MM/DD/YYYY)",
    time: "What time works best for you? We have slots between 9 AM and 5 PM",
  };

  // parthiv commit

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

  const isGreeting = (text) => {
    const greetings = [
      "hi",
      "hello",
      "hey",
      "yo",
      "whatsup",
      "sup",
      "hola",
      "howdy",
      "what's up",
    ];
    return greetings.some((greeting) =>
      text
        .toLowerCase()
        .replace(/[!.?]/g, "")
        .trim()
        .split(/\s+/)
        .some(
          (word) => word.replace(/(.)\1+/g, "$1") === greeting // This handles repeated letters like "hiiii"
        )
    );
  };

  const handleAppointmentResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Starting the appointment process
    if (!appointmentState.isActive && input.includes("yes")) {
      setAppointmentState({
        ...appointmentState,
        isActive: true,
        currentQuestion: "name",
        doctor: messages[messages.length - 1].text.includes("Anderson")
          ? "Dr. Sarah Anderson"
          : "Dr. Michael Chen",
        specialty: messages[messages.length - 1].text.includes("Anderson")
          ? "Orthopedic Specialist"
          : "Dental Surgeon",
      });
      return appointmentQuestions.name;
    }

    // Handle appointment information gathering
    if (appointmentState.isActive) {
      const currentQ = appointmentState.currentQuestion;
      const newPatientInfo = { ...appointmentState.patientInfo };

      // Store the answer to current question
      newPatientInfo[currentQ] = userInput;

      // Determine next question or finish
      let nextQuestion = null;
      switch (currentQ) {
        case "name":
          nextQuestion = "phone";
          break;
        case "phone":
          nextQuestion = "date";
          break;
        case "date":
          nextQuestion = "time";
          break;
        case "time":
          // All info gathered, show summary
          const summary = `Please confirm your appointment details:\n\nDoctor: ${appointmentState.doctor}\nSpecialty: ${appointmentState.specialty}\nPatient Name: ${newPatientInfo.name}\nPhone: ${newPatientInfo.phone}\nDate: ${newPatientInfo.date}\nTime: ${newPatientInfo.time}\n\nWould you like to confirm this appointment?`;
          setAppointmentState({
            ...appointmentState,
            currentQuestion: "confirm",
            patientInfo: newPatientInfo,
          });
          return summary;
        case "confirm":
          if (input.includes("yes")) {
            setAppointmentState({
              isActive: false,
              currentQuestion: null,
              doctor: null,
              specialty: null,
              patientInfo: {
                name: null,
                phone: null,
                date: null,
                time: null,
              },
            });
            return "Great! Your appointment has been confirmed. We'll send a confirmation text to your phone number. See you soon!";
          } else {
            setAppointmentState({
              isActive: false,
              currentQuestion: null,
              doctor: null,
              specialty: null,
              patientInfo: {
                name: null,
                phone: null,
                date: null,
                time: null,
              },
            });
            return "I understand. Would you like to restart the appointment booking process?";
          }
      }

      if (nextQuestion) {
        setAppointmentState({
          ...appointmentState,
          currentQuestion: nextQuestion,
          patientInfo: newPatientInfo,
        });
        return appointmentQuestions[nextQuestion];
      }
    }

    return null;
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

      setTimeout(() => {
        // First check if it's a greeting
        if (isGreeting(input)) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Hey! How can I help you today?", sender: "bot" },
          ]);
          return;
        }

        // Check if we're in appointment flow
        const appointmentResponse = handleAppointmentResponse(input);
        if (appointmentResponse) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: appointmentResponse, sender: "bot" },
          ]);
          return;
        }

        // Regular scenario detection
        const scenario = detectScenario(input);
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
          Health Hospital
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
        HA
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
