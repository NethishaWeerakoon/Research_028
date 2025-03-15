import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const questions = [
  "You regularly make new friends.",
  "You spend a lot of your free time exploring various random topics that pique your interest.",
  "Seeing other people cry can easily make you feel like you want to cry too.",
  "You often make a backup plan for a backup plan.",
  "You usually stay calm, even under a lot of pressure.",
  "At social events, you rarely try to introduce yourself to new people and mostly talk to the ones you already know.",
  "You prefer to completely finish one project before starting another.",
  "You are very sentimental.",
  "You like to use organizing tools like schedules and lists.",
  "Even a small mistake can cause you to doubt your overall abilities and knowledge.",
  "You feel comfortable just walking up to someone you find interesting and striking up a conversation.",
  "You are not too interested in discussing various interpretations and analyses of creative works.",
  "You are more inclined to follow your head than your heart.",
  "You usually prefer just doing what you feel like at any given moment instead of planning a particular daily routine.",
  "You rarely worry about whether you make a good impression on people you meet.",
  "You enjoy participating in group activities.",
  "You like books and movies that make you come up with your own interpretation of the ending.",
  "Your happiness comes more from helping others accomplish things than your own accomplishments.",
  "You are interested in so many things that you find it difficult to choose what to try next.",
  "You are prone to worrying that things will take a turn for the worse.",
  "You avoid leadership roles in group settings.",
  "You are definitely not an artistic type of person.",
  "You think the world would be a better place if people relied more on rationality and less on their feelings.",
  "You prefer to do your chores before allowing yourself to relax.",
  "You enjoy watching people argue.",
  "You tend to avoid drawing attention to yourself.",
  "Your mood can change very quickly.",
  "You lose patience with people who are not as efficient as you.",
  "You often end up doing things at the last possible moment.",
  "You have always been fascinated by the question of what, if anything, happens after death.",
  "You usually prefer to be around others rather than on your own.",
  "You become bored or lose interest when the discussion gets highly theoretical.",
  "You find it easy to empathize with a person whose experiences are very different from yours.",
  "You usually postpone finalizing decisions for as long as possible.",
  "You rarely second-guess the choices that you have made.",
  "After a long and exhausting week, a lively social event is just what you need.",
  "You enjoy going to art museums.",
  "You often have a hard time understanding other people’s feelings.",
  "You like to have a to-do list for each day.",
  "You rarely feel insecure.",
  "You avoid making phone calls.",
  "You often spend a lot of time trying to understand views that are very different from your own.",
  "In your social circle, you are often the one who contacts your friends and initiates activities.",
  "If your plans are interrupted, your top priority is to get back on track as soon as possible.",
  "You are still bothered by mistakes that you made a long time ago.",
  "You rarely contemplate the reasons for human existence or the meaning of life.",
  "Your emotions control you more than you control them.",
  "You take great care not to make people look bad, even when it is completely their fault.",
  "Your personal work style is closer to spontaneous bursts of energy than organized and consistent efforts.",
  "When someone thinks highly of you, you wonder how long it will take them to feel disappointed in you.",
  "You would love a job that requires you to work alone most of the time.",
  "You believe that pondering abstract philosophical questions is a waste of time.",
  "You feel more drawn to places with busy, bustling atmospheres than quiet, intimate places.",
  "You know at first glance how someone is feeling.",
  "You often feel overwhelmed.",
  "You complete things methodically without skipping over any steps.",
  "You are very intrigued by things labeled as controversial.",
  "You would pass along a good opportunity if you thought someone else needed it more.",
  "You struggle with deadlines.",
  "You feel confident that things will work out for you."
];

const options = [
  { label: "Strongly Agree", value: 3 },
  { label: "Agree", value: 2 },
  { label: "Somewhat Agree", value: 1 },
  { label: "Neutral", value: 0 },
  { label: "Somewhat Disagree", value: -1 },
  { label: "Disagree", value: -2 },
  { label: "Strongly Disagree", value: -3 },
];


const QuizForm = () => {
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [predictedPersonality, setPredictedPersonality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(false);

  const progress = (responses.filter(r => r !== null).length / questions.length) * 100;

  useEffect(() => {
    Swal.fire({
      title: "Welcome to the Personality Quiz!",
      text: "Answer all questions honestly to get an accurate personality prediction.",
      icon: "info",
      confirmButtonText: "Got it!"
    });
  }, []);

  const handleChange = (index, value) => {
    setResponses(prev => {
      const updated = [...prev];
      updated[index] = Number(value);
      return updated;
    });
    setValidationError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (responses.includes(null)) {
      setValidationError(true);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:8000/predict_personality/", { quiz_responses: responses });
      setPredictedPersonality(data.predicted_personality);
      Swal.fire({
        title: "Quiz Completed!",
        text: `Your predicted personality type is: ${data.predicted_personality}`,
        icon: "success",
        confirmButtonText: "Awesome!"
      });
    } catch (error) {
      setError("Error predicting personality. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen d-flex flex-column justify-content-center align-items-center bg-light p-4">
      <motion.div className="w-100 mb-3" style={{ position: "sticky", top: "0", zIndex: "10" }}>
        <div className="progress" style={{ height: "8px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <div className="text-center mt-2">{Math.round(progress)}%</div>
      </motion.div>
      <motion.div
        className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-6 max-w-3xl mx-auto text-gray-700 animate-fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">🔍 About the Personality Quiz</h2>
        <p className="text-lg">
          Welcome to the <span className="text-blue-600 font-semibold">Personality Quiz!</span> This quiz consists of
          <span className="text-blue-600 font-semibold"> 60 carefully designed questions</span> aimed at analyzing different aspects
          of your personality, decision-making style, emotional tendencies, and social interactions.
        </p>

        <h5 className="text-xl font-semibold text-blue-600 mt-4">💡 How It Works:</h5>
        <ul className="list-none mt-2 space-y-2">
          <li className="relative pl-6 before:content-['✔'] before:absolute before:left-0 before:text-green-500 before:font-bold">
            Each question presents a statement about your thoughts, feelings, or behaviors.
          </li>
          <li className="relative pl-6 before:content-['✔'] before:absolute before:left-0 before:text-green-500 before:font-bold">
            You will choose from a <span className="font-semibold">7-point scale</span> ranging from
            <span className="text-blue-600 font-semibold"> Strongly Agree</span> to <span className="text-blue-600 font-semibold">Strongly Disagree</span>.
          </li>
          <li className="relative pl-6 before:content-['✔'] before:absolute before:left-0 before:text-green-500 before:font-bold">
            Your responses will be analyzed to determine your <span className="font-semibold text-blue-600">Personality Type</span>.
          </li>
        </ul>

        <h5 className="text-xl font-semibold text-blue-600 mt-4">📢 Important Notes:</h5>
        <ul className="list-none mt-2 space-y-2">
          <li className="relative pl-6 before:content-['✔'] before:absolute before:left-0 before:text-green-500 before:font-bold">
            This quiz is <span className="text-blue-600 font-semibold">not a clinical assessment</span> but rather a self-awareness tool.
          </li>
          <li className="relative pl-6 before:content-['✔'] before:absolute before:left-0 before:text-green-500 before:font-bold">
            <span className="text-red-700 font-bold mb-1">Based on your personality type recruiters will get a idea about yourself...</span>
          </li>
        </ul>

        <p className="text-center text-lg font-semibold text-green-600 mt-4">
          Ready to discover your personality? Let’s begin! 🚀
        </p>
      </motion.div>


      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="card shadow-lg p-5 bg-white w-100 max-w-3xl mt-5">
        <motion.h2 className="text-center mb-4 h3" initial={{ scale: 0.8 }} animate={{ scale: 1.1 }} transition={{ duration: 0.6 }}>
          ✨ Personality Quiz ✨
        </motion.h2>

        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="mb-4 p-4 border rounded shadow-sm" style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#f1f1f1" }}>
              <label className="form-label d-block text-center mb-3 h5" style={{ color: index % 2 === 0 ? "#333" : "#444" }}>
                Q{index + 1}: {question}
              </label>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {options.map(option => (
                  <motion.label key={option.value} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="d-flex flex-column align-items-center p-2">
                    <span className="mb-1 font-weight-bold">{option.label}</span>
                    <input type="radio" value={option.value} checked={responses[index] === option.value} onChange={(e) => handleChange(index, e.target.value)} className="form-check-input" style={{ transform: "scale(1.5)" }} />
                  </motion.label>
                ))}
              </div>
            </motion.div>
          ))}

          {validationError && <motion.div initial={{ x: -10 }} animate={{ x: 10 }} transition={{ repeat: 3, duration: 0.1 }} className="alert alert-danger">Please answer all questions before submitting.</motion.div>}

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn btn-success btn-lg w-100 mt-3" disabled={loading}>
            {loading ? "Processing..." : "Get Prediction"}
          </motion.button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {predictedPersonality && (
          <motion.div className="alert alert-info mt-3 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <strong>Your Personality Type:</strong>
            <motion.div className="mt-3" initial={{ scale: 0.5 }} animate={{ scale: 1.5 }} transition={{ duration: 0.5 }}>
              {predictedPersonality}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizForm;
