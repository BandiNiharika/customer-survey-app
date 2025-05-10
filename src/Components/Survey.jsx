import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Survey.css";

const questions = [
  { id: 1, text: "How satisfied are you with our products?", type: "rating", scale: 5 },
  { id: 2, text: "How fair are the prices compared to similar retailers?", type: "rating", scale: 5 },
  { id: 3, text: "How satisfied are you with the value for money of your purchase?", type: "rating", scale: 5 },
  { id: 4, text: "On a scale of 1-10, how would you recommend us to your friends and family?", type: "rating", scale: 10 },
  { id: 5, text: "What could we do to improve our service?", type: "text" },
];

const Survey = () => {
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(""); // 🆕 Error state for validation messages

  useEffect(() => {
    let storedSession = localStorage.getItem("sessionId");
    if (!storedSession) {
      storedSession = uuidv4();
      localStorage.setItem("sessionId", storedSession);
    }
    setSessionId(storedSession);
  }, []);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
    setError(""); // 🆕 Clear error when user answers
  };

  // 🔁 Updated: Validate current answer before proceeding
  const nextQuestion = () => {
    const currentId = questions[currentQuestion].id;
    if (!answers[currentId] || answers[currentId].toString().trim() === "") {
      setError("Please answer this question before proceeding.");
      return;
    }
    setError("");
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    setError(""); // 🆕 Clear error on back
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 🔁 Updated: Check that all questions are answered before submitting
  const handleSubmit = () => {
    const allAnswered = questions.every(q => answers[q.id] && answers[q.id].toString().trim() !== "");
    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
      return;
    }

    localStorage.setItem("surveyResponses", JSON.stringify({ sessionId, answers }));
    setSubmitted(true);
  };

  return (
    <div className="survey-wrapper">
      {!started ? (
        <div className="welcome-screen">
          <h2>Welcome to Our Survey! 🎉</h2>
          <p>We appreciate your time in helping us improve our services.</p>
          <button className="start-btn" onClick={handleStart}>Start Survey</button>
        </div>
      ) : submitted ? (
        <div className="thank-you">
          <h2>Thank You for Your Feedback! 🎉</h2>
          <p>We appreciate your time and will use your feedback to improve our services.</p>
        </div>
      ) : (
        <div className="survey-container">
          <h2 className="survey-header">Survey {currentQuestion + 1}/{questions.length}</h2>
          <p className="survey-question">{questions[currentQuestion].text}</p>

          {questions[currentQuestion].type === "rating" ? (
            <div className="rating-buttons">
              {[...Array(questions[currentQuestion].scale)].map((_, i) => (
                <button
                  key={i}
                  className={answers[questions[currentQuestion].id] === i + 1 ? "selected" : ""}
                  onClick={() => handleAnswer(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className="text-answer"
              value={answers[questions[currentQuestion].id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          )}

          {/* 🆕 Show validation error message */}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          <div className="navigation-buttons">
            <button className="prev-btn" onClick={prevQuestion} disabled={currentQuestion === 0}>
              Previous
            </button>
            <button
              className="next-btn"
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </button>
            {currentQuestion === questions.length - 1 && (
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Survey;
