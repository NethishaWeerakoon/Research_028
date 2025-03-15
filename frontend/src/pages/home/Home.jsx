import { useNavigate } from "react-router-dom";
import { useSpring, useTrail, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.roleType === "Recruiter") {
      navigate("/my-jobs");
    } else if (user?.roleType === "Job Seeker") {
      navigate("/resume");
    } else {
      navigate("/sign-up");
    }
  };

  const handleTakeQuiz = () => {
    navigate("/personality-type-quiz");
  };

  // Scroll-Based Animations (Trigger When Visible)
  const [fadeRef, fadeInView] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [leftRef, leftInView] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [rightRef, rightInView] = useInView({ triggerOnce: true, threshold: 0.4 });

  // 🔄 Continuous Bouncing Effect
  const bounce = useSpring({
    transform: "scale(1)",
    from: { transform: "scale(0.97)" },
    config: { mass: 1, tension: 200, friction: 8 },
    loop: { reverse: true },
  });

  // 🔵 Smooth Fade & Slide-In Animations
  const fadeIn = useSpring({
    opacity: fadeInView ? 1 : 0,
    transform: fadeInView ? "translateY(0px)" : "translateY(20px)",
    config: { duration: 700 },
  });

  const slideInLeft = useSpring({
    transform: leftInView ? "translateX(0%)" : "translateX(-10%)",
    opacity: leftInView ? 1 : 0,
    config: { tension: 200, friction: 20 },
  });

  const slideInRight = useSpring({
    transform: rightInView ? "translateX(0%)" : "translateX(10%)",
    opacity: rightInView ? 1 : 0,
    config: { tension: 200, friction: 20 },
  });

  // 🔥 Trail Animation for List Items
  const trail = useTrail(3, {
    opacity: leftInView ? 1 : 0,
    transform: leftInView ? "translateY(0px)" : "translateY(20px)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 400 },
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-20 px-4 shadow-lg">
        <h1 className="text-5xl font-extrabold">🚀 Find Your Perfect Job</h1>
        <p className="mt-4 text-xl font-medium">
          AI-powered job recommendations based on your skills & experience.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-6 bg-white text-blue-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
        >
          Get Started 🚀
        </button>
      </div>

      {/* Personality Quiz Section with React Spring */}
      <div className="bg-purple-400 py-16 px-6 text-center min-h-[500px] overflow-hidden">
        <animated.h2 ref={fadeRef} style={fadeIn} className="text-4xl font-extrabold text-gray-900">
          🧠 Discover Your Personality Type! 🎯
        </animated.h2>

        <animated.p ref={leftRef} style={slideInLeft} className="mt-6 text-xl text-gray-800 max-w-3xl mx-auto font-medium">
          Are you curious about your true personality? 🤔 Take our <strong>AI-powered Personality Quiz</strong> and unlock insights into your <strong>strengths, decision-making style, emotions, and social interactions!</strong>
        </animated.p>

        <animated.div ref={rightRef} style={slideInRight} className="mt-8 text-lg text-gray-900 font-semibold bg-purple-700 p-6 rounded-lg shadow-md max-w-xl mx-auto">
          ✅ 60 Carefully Designed Questions <br />
          ✅ Instant Personality Prediction <br />
          ✅ Gain Deeper Self-Understanding
        </animated.div>
 
        <animated.p ref={fadeRef} style={fadeIn} className="mt-6 text-lg text-gray-800 max-w-3xl mx-auto">
          This quiz isn’t just for fun—it provides <strong>valuable insights</strong> into your unique traits and how they shape both your personal and professional life. 💡
        </animated.p>

        <animated.h3 style={bounce} className="mt-10 text-3xl font-bold text-gray-900">
          🎯 Why Take This Quiz?
        </animated.h3>

        {/* Animated List Items */}
        <div ref={leftRef}>
          {trail.map((props, index) => (
            <animated.p key={index} style={props} className="text-lg text-gray-800 mt-4 font-medium">
              {index === 0 && "✔️ Understand how you think and behave"}
              {index === 1 && "✔️ Discover what makes you stand out in work and social settings"}
              {index === 2 && "✔️ Use your results for self-improvement & career growth"}
            </animated.p>
          ))}
        </div>

        <animated.h3 ref={fadeRef} style={fadeIn} className="mt-10 text-3xl font-bold text-gray-900">
          📢 Your Personality Type Matters!
        </animated.h3>

        <animated.p ref={rightRef} style={slideInRight} className="mt-6 text-lg text-gray-800 max-w-3xl mx-auto">
          Recruiters often assess personality traits to determine if you are the right fit for a role.
          Understanding your personality <strong>can give you a competitive edge</strong> in job applications and professional growth! 🚀
        </animated.p>

        <animated.button
          style={bounce}
          onClick={handleTakeQuiz}
          className="mt-10 bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-800 transition transform hover:scale-110 hover:shadow-2xl"
        >
          Take the Quiz Now 🎯
        </animated.button>
      </div>
    </div>
  );
}
