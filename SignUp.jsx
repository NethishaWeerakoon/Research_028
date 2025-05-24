import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Select } from "flowbite-react";
import { Button, Label, Spinner } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SignUp() {
  const [formData, setFormData] = useState({ roleType: "Job Seeker" });
  const [, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id || e.target.name]: e.target.value.trim(),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.roleType
    ) {
      return Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill out all fields.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      // Send form data to the server for registration
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}users/register`,
        formData
      );
      const data = response.data;

      if (response.status !== 200 || data.success === false) {
        return Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }

      setLoading(false);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your account has been successfully created.",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      }).then(() => {
        navigate("/sign-in");
      });
    } catch (error) {
      setLoading(false);

      // Check if error has a response object and handle accordingly
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.message || "Server error. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Server error. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-indigo-300">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left side with Welcome Text and Image */}
        <div
          className="flex-1 p-8 text-white flex flex-col justify-center relative"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
          }}
        >
          <div className="absolute inset-0 bg-opacity-50 bg-black z-0">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              alt="Welcome"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          
        </div>

        {/* Right side with Sign Up Form */}
        <div className="flex-1 p-8 bg-purple-500 flex justify-center items-center">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Register
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Full Name" className="text-white text-lg mb-2" />
                <TextInput
                  type="text"
                  placeholder="Full Name"
                  id="fullName"
                  className="w-full p-2 rounded-lg border-2 border-purple-300 bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-white focus:border-white"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Email" className="text-white text-lg mb-2" />
                <TextInput
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="w-full p-2 rounded-lg border-2 border-purple-300 bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-white focus:border-white"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Password" className="text-white text-lg mb-2" />
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="w-full p-2 rounded-lg border-2 border-purple-300 bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-white focus:border-white"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="User Type" className="text-white text-lg mb-2" />
                <Select
                  name="roleType"
                  className="w-full p-2 rounded-lg border-2 border-purple-300 bg-white bg-opacity-20 text-white focus:ring-2 focus:ring-white focus:border-white"
                  onChange={handleChange}
                  required
                  defaultValue="Job Seeker"
                >
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Recruiter">Recruiter</option>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-green-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <div className="text-center mt-4">
              <p className="text-white text-lg">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="font-semibold underline hover:text-teal-300 transition-colors duration-300"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}