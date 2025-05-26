import learningcover from "../../assets/learning/learningcover.png";
import { motion } from "framer-motion";
import { FaLightbulb, FaBookOpen, FaChartLine, FaGraduationCap, FaUserTie, FaClock } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function Learning() {
  const [isLearningTypeCompleted, setIsLearningTypeCompleted] = useState(false);
  const [stats, setStats] = useState({
    users: 12500,
    successRate: 92,
    courses: 150
  });

  // Check if the user has completed the learning type quiz
  useEffect(() => {
    const completed = localStorage.getItem("isLearningTypeCompleted") === "true";
    setIsLearningTypeCompleted(completed);
    

    const timer = setTimeout(() => {
      setStats({
        users: 12876,
        successRate: 93,
        courses: 156
      });
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

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


  const handleChooseTopicClick = () => {
    if (!isLearningTypeCompleted) {
      Swal.fire({
        icon: "info",
        title: "Complete Your Learning Profile",
        html: `
          <div class="text-left">
            <p class="mb-3">To get the most personalized learning experience, we first need to understand how you learn best.</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Takes just 3-5 minutes</li>
              <li>Unlocks personalized recommendations</li>
              <li>Helps us optimize your learning path</li>
            </ul>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Take Quiz Now",
        cancelButtonText: "Maybe Later",
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#6b7280",
        backdrop: `
          rgba(0,0,0,0.7)
          url("/images/learning-path.gif")
          center top
          no-repeat
        `,
        footer: '<a href="/learning-benefits">Why this matters for your success?</a>'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/learning-type";
        }
      });
    } else {
      window.location.href = "/topic-select";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 to-blue-200 pt-20">

      <section className="px-4 py-12 md:px-8 md:py-20 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
     
          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                Personalized Learning Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 leading-tight">
                Discover Your Optimal Learning Path
              </h1>
            </motion.div>
            
            <motion.p
              className="text-lg md:text-xl  text-gray-800 leading-relaxed"
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
              className="flex flex-wrap gap-4"
              variants={fadeInUp}
            >
                          <a
              href="/learning-type"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <IoMdCheckmarkCircleOutline className="text-xl" />
              Start Free Assessment
            </a>
              <a
                href="/demo"
                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400  text-purple-800 font-medium py-3 px-6 rounded-lg shadow-sm transition-all hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                </svg>
                Watch Demo
              </a>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <img
                src={learningcover}
                alt="Happy diverse students learning together"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <span className="inline-block bg-blue-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold  text-purple-800 mb-4">
                Your Personalized Learning Journey
              </h2>
              <p className="text-lg text-purple-800 max-w-3xl mx-auto">
                Our 3-step process ensures you get the most effective learning experience tailored specifically to how you learn best.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FaLightbulb className="text-3xl" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded mb-2">
                    STEP 1
                  </span>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Discover Your Learning DNA
                  </h3>
                  <p className="text-gray-600">
                    Our  assessment identifies your unique learning style, cognitive strengths, and knowledge retention patterns.
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <a
                    href="/learning-type"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <FaClock className="text-sm" />
                    Start Assessment
                  </a>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300"></div>
                <div className="flex justify-center mb-6">
                  <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <FaBookOpen className="text-3xl" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <span className="inline-block bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-1 rounded mb-2">
                    STEP 2
                  </span>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Customized Learning Path
                  </h3>
                  <p className="text-gray-600">
                    Based on your assessment, we recommend the most effective learning methods, resources, and pace for your style.
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleChooseTopicClick}
                    className={`w-full ${
                      isLearningTypeCompleted
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        : "bg-gray-300 cursor-not-allowed"
                    } text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2`}
                    disabled={!isLearningTypeCompleted}
                  >
                    {isLearningTypeCompleted ? (
                      <>
                        <FaBookOpen className="text-sm" />
                        Select Topics
                      </>
                    ) : (
                      "Complete Step 1 First"
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-300"></div>
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    <FaChartLine className="text-3xl" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded mb-2">
                    STEP 3
                  </span>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Track & Optimize
                  </h3>
                  <p className="text-gray-600">
                    Monitor your progress with detailed analytics and get adaptive recommendations to continuously improve your learning.
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <a
                    href="/learning-progress"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <FaChartLine className="text-sm" />
                    View Dashboard
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <span className="inline-block bg-blue-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                SUCCESS STORIES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
                Learners Just Like You Are Achieving More
              </h2>
              <p className="text-lg text-purple-700 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our community has to say.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Data Scientist, Google</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Discovering my learning type was a game-changer. I went from struggling with machine learning concepts to mastering them in half the time!"
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Medical Student, Harvard</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "As a visual learner, I was wasting time with traditional study methods. The personalized resources recommended for my type helped me score in the top 5%."
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Priya Patel</h4>
                    <p className="text-sm text-gray-500">Software Engineer, Microsoft</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "The learning type assessment helped me understand why certain training programs worked and others didn't. My productivity has increased by 40%."
                </p>
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-6" variants={fadeInUp}>
              Ready to Transform Your Learning?
            </motion.h2>
            <motion.p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8" variants={fadeInUp}>
              Join thousands of successful learners who've discovered their optimal path to knowledge.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a
                href="/learning-type"
                className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg transition-all hover:scale-105"
              >
                <FaLightbulb className="mr-2" />
                Start Your Free Assessment Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}