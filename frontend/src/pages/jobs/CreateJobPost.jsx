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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Loading />
      <p className="text-gray-600 text-lg ml-4">Loading ...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl font-bold text-blue-700 mb-4">
          Build Your Job Post
        </h1>

        <div className="grid gap-6">
          <div className="bg-white shadow-md rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Job Information
            </h2>
            <div className="flex lg:flex-col">
              <div className="flex gap-2">
                <div className="flex flex-col w-full">
                  <h2 className="text-md ">Job Title</h2>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg mb-2 p-2"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <h2 className="text-md ">Job Experience</h2>
                  <input
                    type="text"
                    name="experience"
                    placeholder="Experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg mb-2 p-2"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col w-full">
                  <h2 className="text-md ">Job Email</h2>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg mb-2 p-2"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <h2 className="text-md ">Contact Number</h2>
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg mb-2 p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-5">
            <div className="flex flex-col w-full">
              <h2 className="text-md ">Job Description</h2>
              <textarea
                name="description"
                placeholder="Job Description (comma-separated)"
                value={formData.description}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg mb-2 p-2 h-60"
              />
            </div>
            <div className="flex flex-col w-full">
              <h2 className="text-md ">Job Requirements</h2>
              <textarea
                name="requirements"
                placeholder="Job Requirements (comma-separated)"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg p-2 h-60"
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <h2 className="text-md">HR Questions</h2>
              <textarea
                name="hrQuestions"
                placeholder="HR Questions (one per line)"
                value={formData.hrQuestions}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg p-2 h-60"
                rows={10}
              />
              <p className="text-sm text-gray-500 mt-1">
                Edit the HR questions above (one question per line)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5 mt-4">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Choose a Template
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[template1, template2, template3].map((template, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden border"
              >
                <img
                  src={template}
                  alt={`Template ${index + 1}`}
                  className="w-full  object-cover"
                />
                <button
                  onClick={() => navigate(`/job-template${index + 1}`)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5 mt-4">
          <h2 className="text-md">Job Template</h2>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full border-gray-300 rounded-lg mb-2 p-2"
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="w-32 h-32 object-contain mt-2"
            />
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={clearLocalStorage}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-700"
          >
            Reset Form
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;
