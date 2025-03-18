import learningcover from "../../assets/learning/learningcover.png";
import { motion } from "framer-motion";
import { FaLightbulb, FaBookOpen, FaChartLine } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function Learning() {
  const [isLearningTypeCompleted, setIsLearningTypeCompleted] = useState(false);

  // Check if the user has completed the learning type quiz
  useEffect(() => {
    const completed = localStorage.getItem("isLearningTypeCompleted") === "true";
    setIsLearningTypeCompleted(completed);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Handle navigation to the second step
  const handleChooseTopicClick = () => {
    if (!isLearningTypeCompleted) {
      Swal.fire({
        icon: "error",
        title: "Complete Step 1 First",
        text: "Please complete the Learning Type Identification quiz before selecting a topic.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } else {
      window.location.href = "/topic-select";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-purple-100 pt-20">
     
      <section className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Image Section */}
          <motion.div
            className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-center"
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
          >
            <img
              src={learningcover}
              alt="Learning Cover"
              className="max-w-full h-auto px-0 md:px-20"
            />
          </motion.div>

          
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
              variants={fadeInUp}
            >
              Achieve Your Goals With the Right Learning Path
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg md:text-xl mb-8"
              variants={fadeInUp}
            >
              Our Learning Type Identification platform simplifies understanding
              your unique learning style. With personalized insights,
              customizable resources, and an intuitive interface, you can
              enhance your skills and achieve your goals. Perfect for students,
              professionals, and lifelong learners. Start today and discover the
              most effective way to learn.
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center md:justify-start"
              variants={fadeInUp}
            >
              <a
                href="/learning-type"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all hover:scale-105"
              >
                Find Learning Type
              </a>
              <a
                href="/learning-progress"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all hover:scale-105"
              >
                Learning Progress Dashboard
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="p-8 md:p-12 bg-white">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
            variants={fadeInUp}
          >
            Follow These Steps to Optimize Your Learning
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Learning Type Identification */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="flex justify-center mb-4">
                <FaLightbulb className="text-6xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Step 1: Identify Your Learning Type
              </h3>
              <p className="text-gray-600 text-center">
                Take a quick quiz to discover your unique learning style. This
                will help us tailor the best learning path for you.
              </p>
              <div className="mt-6 flex justify-center">
                <a
                  href="/learning-type"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-105"
                >
                  Start Quiz
                </a>
              </div>
            </motion.div>

            {/* Step 2: Select Learning Path */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="flex justify-center mb-4">
                <FaBookOpen className="text-6xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Step 2: Select Your Learning Path
              </h3>
              <p className="text-gray-600 text-center">
                Based on your learning type, choose a topic or skill to focus
                on. We'll provide personalized resources to help you succeed.
              </p>
              <div className="mt-6 flex justify-center">
               
              </div>
            </motion.div>

            {/* Step 3: View Profile */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="flex justify-center mb-4">
                <FaChartLine className="text-6xl text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Step 3: View Your Profile
              </h3>
              <p className="text-gray-600 text-center">
                Get detailed insights into your learning type, progress, and
                recommendations. Track your growth and stay motivated.
              </p>
              <div className="mt-6 flex justify-center">
                <a
                  href="/my-profile"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-105"
                >
                  View Profile
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}