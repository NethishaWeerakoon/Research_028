import { FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Navbar, Badge, Dropdown } from "flowbite-react";
import logo from "../../assets/logo.png";

export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const path = useLocation().pathname;
  const navigate = useNavigate();

  // Check localStorage for user data and token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const user = JSON.parse(userData); // Parse stored user data
      setCurrentUser(user); // Store user info in state
      fetchNotifications(user._id); // Fetch notifications for the user if token and user exist
    }
  }, []); 

  // Fetch notifications for the logged-in user from the API
  const fetchNotifications = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}notification/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      } else {
        console.error("Invalid notifications data:", data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Handle user sign-out by clearing local storage and redirecting to login page
  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/sign-in");
  };

  return (
    <Navbar className="bg-gray-200 shadow-lg">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white flex"
      >
        <img src={logo} className="h-12 lg:h-14" alt="Company Logo" />
      </Link>

      <div className="gap-2 md:order-2 my-auto flex">
        {currentUser ? (
          <>
            {/* Notification Bell */}
            <div className="relative mr-2 mt-1">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <FaBell size={35} />
                {notifications.length > 0 && !showNotifications && (
                  <Badge
                    color="failure"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 z-10 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                  {/* Show loading or notifications */}
                  {loadingNotifications ? (
                    <div className="text-center p-4 text-gray-500">
                      Loading...
                    </div>
                  ) : notifications.length > 0 ? (
                    [...notifications]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      ) // Sort by recent first
                      .slice(0, 5) // Show max 5 initially
                      .map((notification) => (
                        <div
                          key={notification._id}
                          className="flex flex-col p-3 text-md text-gray-600 text-left font-semibold hover:bg-gray-100 border-b"
                        >
                          <span>{notification.message}</span>
                          {/* Link with icon */}
                          {notification.link && (
                            <a
                              href={notification.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-500 hover:underline mt-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-5 h-5 mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.828 10H21v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h10v2H5v14h14v-8h2v10a3 3 0 01-3 3H4a3 3 0 01-3-3V4a3 3 0 013-3h10l4 4v5h-2V5.828l-4-4z"
                                />
                              </svg>
                              View Job
                            </a>
                          )}
                          <span className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Avatar Dropdown */}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={
                    currentUser.img ||
                    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1734322473~exp=1734326073~hmac=c93f070022466ff3b68694aa705563a44f6abe86d5765da63ad61d0b2bbc3750&w=740"
                  }
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{currentUser.roleType}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.fullName}
                </span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              {currentUser.roleType === "Recruiter" && (
                <Dropdown.Item onClick={() => navigate("/my-jobs")}>
                  My Jobs
                </Dropdown.Item>
              )}
              {currentUser.roleType === "Job Seeker" && (
                <Dropdown.Item onClick={() => navigate("/applied-jobs")}>
                  Applied Jobs
                </Dropdown.Item>
              )}
              {currentUser.roleType === "Job Seeker" && (
                <Dropdown.Item onClick={() => navigate("/my-profile")}>
                  My Profile
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Link to="/sign-in">
            <Button color="blue">Sign In</Button>
          </Link>
        )}

        <Navbar.Toggle className="text-blue-600 hover:text-blue-800 focus:ring-blue-300" />
      </div>

      <Navbar.Collapse>
        {currentUser?.roleType === "Recruiter" && (
          <>
            <Navbar.Link
              active={path === "/my-jobs"}
              as={"div"}
              style={{ color: path === "/my-jobs" ? "#384ae2" : "#000" }}
              className="text-lg"
            >
              <Link to="/my-jobs">MY JOBS</Link>
            </Navbar.Link>
            <Navbar.Link
              active={path === "/learning-progress"}
              as={"div"}
              style={{
                color: path === "/learning-progress" ? "#384ae2" : "#000",
              }}
              className="text-lg"
            >
              <Link to="/learning-progress">LEARNING PROGRESS</Link>
            </Navbar.Link>
          </>
        )}

        {currentUser?.roleType === "Job Seeker" && (
          <>
            <Navbar.Link
              active={path === "/"}
              as={"div"}
              style={{ color: path === "/" ? "#384ae2" : "#000" }}
              className="text-md"
            >
              <Link to="/">HOME</Link>
            </Navbar.Link>

            <Navbar.Link
              active={path === "/resume"}
              as={"div"}
              style={{ color: path === "/resume" ? "#384ae2" : "#000" }}
              className="text-md"
            >
              <Link to="/resume">RESUME</Link>
            </Navbar.Link>

            <Navbar.Link
              active={path === "/personality-category"}
              as={"div"}
              style={{
                color: path === "/personality-category" ? "#384ae2" : "#000",
              }}
              className="text-md"
            >
              <Link to="/personality-category">PERSONALITY PREDICTION</Link>
            </Navbar.Link>
         
            <Navbar.Link
              active={path === "/learning"}
              as={"div"}
              style={{ color: path === "/learning" ? "#384ae2" : "#000" }}
              className="text-md"
            >
              <Link to="/learning">LEARNING TEST</Link>
            </Navbar.Link>

            <Navbar.Link
              active={path === "/jobs"}
              as={"div"}
              style={{ color: path === "/jobs" ? "#384ae2" : "#000" }}
              className="text-md"
            >
              <Link to="/jobs">JOBS</Link>
            </Navbar.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
