import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
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

      // API call for login
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}users/login`,
        formData
      );

      if (response.data?.msg) {
        setLoading(false);
        return Swal.fire({
          icon: "error",
          title: "Login Failed!",
          text: response.data.msg,
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }

      // Extract token and user details from the response
      const { token, User } = response.data;
      // Store user details and token in local storage
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: User._id,
          fullName: User.fullName,
          email: User.email,
          roleType: User.roleType,
        })
      );
      localStorage.setItem("token", token);

      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "You have successfully logged in.",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      }).then(() => {
        if (User.roleType === "Recruiter") {
          navigate("/my-jobs");
        } else {
          navigate("/");
        }
        window.location.reload();
      });
    } catch (error) {
      setLoading(false);

      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        if (error.response.data && error.response.data.msg) {
          errorMessage = error.response.data.msg;
        }
      }
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-indigo-300">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left side with Welcome Text and Image */}
        <div
          className="flex-1 p-12 text-white flex flex-col justify-center relative"
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
          <div className="relative z-10">
            {/* <h1 className="text-5xl font-bold mb-6">Welcome ❤️</h1> */}
            {/* <p className="text-lg mb-8">
              Join our community and enjoy seamless access to exclusive features.
            </p> */}
          </div>
        </div>

        {/* Right side with Login Form */}
        <div className="flex-1 p-12 bg-purple-500 flex justify-center items-center">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-white text-center mb-8">
              Login
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label value="Email" className="text-white text-lg mb-2" />
                <TextInput
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="w-full p-3 rounded-lg border-2 border-purple-300 bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-white focus:border-white"
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
                  className="w-full p-3 rounded-lg border-2 border-purple-300 bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-white focus:border-white"
                  required
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
            <div className="text-center mt-6 space-y-4">
              <p className="text-white text-lg">
                Don’t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-semibold underline hover:text-teal-300 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}