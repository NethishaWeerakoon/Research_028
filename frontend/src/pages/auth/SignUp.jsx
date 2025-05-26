import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Select } from "flowbite-react";
import { Alert, Button, Label, Spinner } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";
import background from "../../assets/background.png";

export default function SignUp() {
  const [formData, setFormData] = useState({ roleType: "Job Seeker" });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Controlled Component Pattern: Manage input state
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="flex flex-col items-center p-8 max-w-lg w-full glassmorphism rounded-lg shadow-lg mx-8">
        <img src={logo} alt="Logo" className="h-16 mb-5" />
        <div className="text-4xl mb-3 text-center font-serif">
          CREATE ACCOUNT
        </div>
        <hr className="shadow-lg mb-2 w-full bg-white" />
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div>
            <Label value="Full Name :" className="text-white" />
            <TextInput
              type="text"
              placeholder="Enter Full Name"
              id="fullName"
              className="mt-1"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Email :" className="text-white" />
            <TextInput
              type="email"
              placeholder="Enter Email Address"
              id="email"
              className="mt-1"
              onChange={handleChange}
              required
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Enter Valid Email Address"
            />
          </div>
          <div>
            <Label value="Password :" className="text-white" />
            <TextInput
              type="password"
              placeholder="Enter Password"
              id="password"
              className="mt-1"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="User Type :" className="text-white" />
            <Select
              name="roleType"
              className="mt-1"
              onChange={handleChange}
              required
              defaultValue="Job Seeker"
            >
              <option value="Job Seeker">Job Seeker</option>
              <option value="Recruiter">Recruiter</option>
            </Select>
          </div>
          <Button
            color="blue"
            type="submit"
            disabled={loading}
            className="w-full"
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
        <div className="flex gap-2 text-sm mt-5 text-white">
          <span>Have an account?</span>
          <Link to="/sign-in" className="text-blue-800">
            Sign In
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5 w-full" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
