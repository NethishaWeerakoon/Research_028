import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import template1 from "../../assets/job/template1.png";
import template2 from "../../assets/job/template2.png";
import template3 from "../../assets/job/template3.png";
import Loading from "../../components/Loading";

const CreateJobPost = () => {
  const navigate = useNavigate();

  // Default HR questions if not available
  const defaultHrQuestions = [
    "Tell us about yourself.",
    "Why are you interested in this position?",
    "What are your key strengths, and how do they relate to this role?",
    "Can you describe a challenging situation you faced and how you handled it?",
    "What motivates you to perform at your best?",
    "Describe a time when you had to make a difficult decision at work.",
    "Why do you want to work for our company?",
    "Can you share an example of a successful team project you worked on?",
    "What makes you the right fit for this role?",
    "How do you prioritize your tasks when managing multiple deadlines?",
  ];

  const cancelForm = () => {
    localStorage.removeItem("TempJobPostData");
    localStorage.removeItem("TempJobPostLogo");
    setFormData({
      title: "",
      experience: "",
      email: "",
      contactNumber: "",
      description: "",
      requirements: "",
      hrQuestions: "",
    });
    setLogo(null);
    setLogoPreview(null);
    navigate("/my-jobs");
    window.scrollTo(0, 0);
  };

  // Initialize form state with saved localStorage data
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("TempJobPostData")) || {};
    return {
      title: savedData.title || "",
      experience: savedData.experience || "",
      email: savedData.email || "",
      contactNumber: savedData.contactNumber || "",
      description: savedData.description || "",
      requirements: savedData.requirements || "",
      hrQuestions: savedData.hrQuestions || defaultHrQuestions.join(", "),
    };
  });

  // State for logo file and preview
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load saved job logo from localStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem("TempJobPostLogo");
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
  }, []);

  // Update localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("TempJobPostData", JSON.stringify(formData));
  }, [formData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const previewURL = URL.createObjectURL(file);
      setLogoPreview(previewURL);
      localStorage.setItem("TempJobPostLogo", previewURL);
    }
  };

  // Clear saved data from localStorage and reset form
  const clearLocalStorage = () => {
    localStorage.removeItem("TempJobPostData");
    localStorage.removeItem("TempJobPostLogo");
    setFormData({
      title: "",
      experience: "",
      email: "",
      contactNumber: "",
      description: "",
      requirements: "",
      hrQuestions: defaultHrQuestions.join(", "),
    });
    setLogo(null);
    setLogoPreview(null);
    Swal.fire({
      icon: "success",
      title: "Cleared!",
      text: "All saved data has been cleared!",
      confirmButtonText: "OK",
      confirmButtonColor: "green",
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    const {
      title,
      experience,
      email,
      contactNumber,
      description,
      requirements,
      hrQuestions,
    } = formData;

    // Validation
    if (
      !title ||
      !experience ||
      !email ||
      !contactNumber ||
      !description ||
      !requirements
    ) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required!",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid email format!",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    if (!/^\+?[0-9]{7,15}$/.test(contactNumber)) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid phone number format!",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    if (!logo) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please downolad the flyer and upload!",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "User ID not found in localStorage!",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    // Prepare form data for submission
    const formDataToSend = new FormData();
    formDataToSend.append("title", title);
    formDataToSend.append("experienceYears", parseInt(experience, 10));
    formDataToSend.append("email", email);
    formDataToSend.append("phoneNumber", contactNumber);
    formDataToSend.append("description", description);
    formDataToSend.append("requirements", requirements);
    formDataToSend.append("userId", userId);
    formDataToSend.append("hrQuestions", hrQuestions);
    formDataToSend.append("logo", logo);

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}jobs/create`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Job post created successfully!",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });
        localStorage.removeItem("TempJobPostData");
        localStorage.removeItem("TempJobPostLogo");
        navigate("/my-jobs");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to create job post!",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.error || "An error occurred!",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Display loading state while fetching data
  return loading ? (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="flex items-center p-8 border shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl border-white/20">
        <Loading />
        <p className="ml-4 text-lg font-medium text-slate-600">Loading...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text">
            Build Your Job Post
          </h1>
          <p className="text-lg text-slate-600">Create an engaging job posting to attract top talent</p>
        </div>

        <div className="space-y-8">
          {/* Job Information Card */}
          <div className="p-8 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600"></div>
              <h2 className="text-2xl font-semibold text-slate-800">Job Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter job title..."
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 transition-all duration-200 border bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 hover:bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                    Experience Required
                  </label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g., 2-5 years"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 transition-all duration-200 border bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 hover:bg-white/70"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 transition-all duration-200 border bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 hover:bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="w-1 h-4 rounded-full bg-emerald-500"></span>
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 transition-all duration-200 border bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400 hover:bg-white/70"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Details Card */}
          <div className="p-8 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>
              <h2 className="text-2xl font-semibold text-slate-800">Job Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                  Job Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-4 transition-all duration-200 border resize-none bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 hover:bg-white/70"
                  rows={8}
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                  Job Requirements
                </label>
                <textarea
                  name="requirements"
                  placeholder="List the key qualifications, skills, and requirements for this role..."
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full px-4 py-4 transition-all duration-200 border resize-none bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 hover:bg-white/70"
                  rows={8}
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                  HR Interview Questions
                </label>
                <textarea
                  name="hrQuestions"
                  placeholder="Enter interview questions (one per line)..."
                  value={formData.hrQuestions}
                  onChange={handleChange}
                  className="w-full px-4 py-4 transition-all duration-200 border resize-none bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 hover:bg-white/70"
                  rows={10}
                />
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Edit the HR questions above (one question per line)
                </p>
              </div>
            </div>
          </div>

          {/* Template Selection Card */}
          <div className="p-8 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-orange-500 to-red-500"></div>
              <h2 className="text-2xl font-semibold text-slate-800">Choose a Template</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[template1, template2, template3].map((template, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden transition-all duration-300 bg-white border shadow-md group rounded-xl border-slate-200 hover:shadow-xl hover:scale-105"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={template}
                      alt={`Template ${index + 1}`}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <button
                      onClick={() => navigate(`/job-template${index + 1}`)}
                      className="w-full px-4 py-3 font-medium text-white transition-all duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105 hover:shadow-lg"
                    >
                      Select Template {index + 1}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload Card */}
          <div className="p-8 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-teal-500 to-cyan-600"></div>
              <h2 className="text-2xl font-semibold text-slate-800">Upload Template</h2>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full px-4 py-3 transition-all duration-200 border cursor-pointer bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-teal-500 file:to-cyan-600 file:text-white file:font-medium hover:file:from-teal-600 hover:file:to-cyan-700 file:cursor-pointer hover:bg-white/70"
                />
              </div>
              
              {logoPreview && (
                <div className="flex justify-center">
                  <div className="relative group">
                    <img
                      src={logoPreview}
                      alt="Template Preview"
                      className="object-contain w-40 h-40 transition-all duration-200 border shadow-md border-slate-200 rounded-xl group-hover:shadow-lg"
                    />
                    <div className="absolute inset-0 transition-all duration-200 bg-black/0 group-hover:bg-black/10 rounded-xl"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-4 pt-2 mt-2 border-t border-slate-200">
  <button
    onClick={clearLocalStorage}
    className="px-6 py-3 font-medium text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 hover:scale-105 hover:shadow-xl"
  >
    Reset Form
  </button>

  <button
    onClick={cancelForm}
    className="px-6 py-3 font-medium text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl hover:from-slate-600 hover:to-slate-700 hover:scale-105 hover:shadow-xl"
  >
    Cancel
  </button>

  <button
    onClick={handleSubmit}
    className="px-6 py-3 font-medium text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:from-emerald-600 hover:to-green-700 hover:scale-105 hover:shadow-xl"
  >
    Publish Job Post
  </button>
</div>

      </div>
    </div>
  );
};

export default CreateJobPost;