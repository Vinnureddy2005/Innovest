"use client"
import { useEffect, useState } from "react";

const FeedbackPopup = ({startupId,startupName,clientEmail,Invphoto, onClose }) => {

const now = new Date();
const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const year = now.getFullYear();

const today = `${day}-${month}-${year}`;
  const [feedback, setFeedback] = useState({
    investorName: "",
    investorEmail: "",
    startupId:"",
    startupName:"",
    clarity: "",
    feasibility: "",
    uniqueness: "",
    improvementSuggestions: "",
    overallRating: "",
    clientEmail:"",
    date:today,
    Invphoto:""
  });

 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  setFeedback((prev) => ({
    ...prev,
    investorEmail: email || "",
    startupName: startupName || "",
    clientEmail:clientEmail||"",
    Invphoto:Invphoto||"",
    startupId:startupId||""
  }));

  if (email) {
    fetch("/api/inv_name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupName, email,clientEmail,Invphoto }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.fullName) {
          setFeedback((prev) => ({
            ...prev,
            investorName: data.fullName,
          }));
        }
      })
      .catch((err) => console.error("Error fetching investor name:", err));
  }
}, [startupName]);


  const handleChange = (e) => {
    setFeedback((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    for (const [key, value] of Object.entries(feedback)) {
      if (!value) {
        alert(`Missing field: ${key}`);
        return;
      }
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (res.ok) {
        alert("Feedback submitted successfully!");
        onClose();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit feedback. Try again.");
    }
  };

  return (
   <div
className="fixed inset-0 flex items-center justify-center bg-transparent  backdrop-blur-sm z-50"
  aria-modal="true"
  role="dialog"
  aria-labelledby="feedback-title"
>

      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full relative border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Close feedback form"
        >
          &times;
        </button>

        <h2
          id="feedback-title"
          className="text-xl font-semibold text-indigo-600 mb-4 text-center"
        >
          Startup Idea Feedback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="clarity">
              How clear is the startup idea?
            </label>
            <select
              id="clarity"
              name="clarity"
              required
              value={feedback.clarity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" disabled>
                Select clarity level
              </option>
              <option>Very Clear</option>
              <option>Somewhat Clear</option>
              <option>Neutral</option>
              <option>Somewhat Unclear</option>
              <option>Very Unclear</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="feasibility">
              How feasible is this idea to implement?
            </label>
            <select
              id="feasibility"
              name="feasibility"
              required
              value={feedback.feasibility}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" disabled>
                Select feasibility
              </option>
              <option>Highly Feasible</option>
              <option>Feasible</option>
              <option>Moderately Feasible</option>
              <option>Less Feasible</option>
              <option>Not Feasible</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="uniqueness">
              How unique or innovative is the idea?
            </label>
            <select
              id="uniqueness"
              name="uniqueness"
              required
              value={feedback.uniqueness}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" disabled>
                Select uniqueness
              </option>
              <option>Very Unique</option>
              <option>Somewhat Unique</option>
              <option>Neutral</option>
              <option>Somewhat Common</option>
              <option>Very Common</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="improvementSuggestions">
              Suggestions to improve this idea
            </label>
            <textarea
              id="improvementSuggestions"
              name="improvementSuggestions"
              rows="3"
              placeholder="Your thoughts here..."
              value={feedback.improvementSuggestions}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="overallRating">
              Overall rating
            </label>
            <select
              id="overallRating"
              name="overallRating"
              required
              value={feedback.overallRating}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" disabled>
                Select rating
              </option>
              <option>5 - Excellent</option>
              <option>4 - Good</option>
              <option>3 - Average</option>
              <option>2 - Poor</option>
              <option>1 - Very Poor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;
