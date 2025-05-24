import { useNavigate } from "react-router-dom";
import ResumeDetails from "../../components/profile/ResumeDetails";
import CompanyDetails from "../../components/profile/CompanyDetails";
import QuizResults from "../../components/profile/QuizResult";

const MyProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <div className="flex gap-10 justify-end my-6">
        <button
          onClick={() => navigate("/company-details")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
        >
          Fill Previous Company Details
        </button>
        {/* <button
          onClick={() => navigate(`/company-response/${userId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
        >
          Company Response Form
        </button> */}
      </div>
      <ResumeDetails />
      <CompanyDetails />
      <QuizResults />
    </div>
  );
};

export default MyProfile;
 