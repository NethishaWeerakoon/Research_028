import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";
import background from "../../assets/background.png";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
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

      // Check if the response contains an error message
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

      // Display success message and redirect user based on role type
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "You have successfully logged in.",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      }).then(() => {
        navigate("/");
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="flex flex-col items-center p-8 max-w-lg w-full glassmorphism rounded-lg shadow-2xl mx-8">
        <img src={logo} alt="Logo" className="h-16 mb-5" />
        <div className="text-4xl mb-3 text-center font-serif">LOGIN</div>
        <hr className="shadow-lg mb-2 w-full bg-white" />
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div>
            <Label value="Email :" className="text-white" />
            <TextInput
              type="email"
              placeholder="Enter Email Address"
              id="email"
              className="mt-1"
              required
              onChange={handleChange}
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
              "Log In"
            )}
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5 font-serif text-white">
          <span>Do not have an account?</span>
          <Link to="/sign-up" className="text-blue-800">
            Sign Up
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
