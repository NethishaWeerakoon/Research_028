import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/public/Header";
import Footers from "./components/public/Footer";
import Resume from "./pages/resume/Resume";
import CreateResume from "./pages/resume/CreateResume";
import Template1 from "./pages/resume/ResumeTemplate1";
import Template2 from "./pages/resume/ResumeTemplate2";
import Template3 from "./pages/resume/ResumeTemplate3";
import JobList from "./pages/jobs/JobList";
import Learning from "./pages/learning/Learning";
import LearningTypeQuiz from "./pages/learning/LearningTypeQuiz";
import LearningProgress from "./pages/learning/LearningProgress";
import CreateJobPost from "./pages/jobs/CreateJobPost";
import JobTemplate1 from "./pages/jobs/JobTemplate1";
import JobTemplate2 from "./pages/jobs/JobTemplate2";
import JobTemplate3 from "./pages/jobs/JobTemplate3";
import MyJobs from "./pages/jobs/MyJobs";
import PersonalityQuiz from "./pages/learning/PersonalityQuiz";
import CompanyDetailsForm from "./pages/company/CompanyDetailsForm";
import CompanyResponseForm from "./pages/company/CompanyResponseForm";
import VideoUpload from "./pages/learning/VideoUpload";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import JobDetails from "./pages/jobs/JobDetails";
import MyProfile from "./pages/auth/MyProfile";
import ApplicantResume from "./pages/applicant/ApplicantResume";
import ApplicantVideo from "./pages/applicant/ApplicantVideo";
import RecommendedJobs from "./pages/jobs/RecommendedJobs";
import LearningType from "./pages/learning/LearningType";
import TopicSelect from "./pages/learning/TopicSelect";
import AppliedAllJobs from "./pages/jobs/AppliedAllJobs";
import Reference from "./pages/learning/Reference";
import ProtectedRoute from "./components/public/ProtectedRoute";
import Home from "./pages/home/Home";
import ApplicantRecommended from "./pages/applicant/ApplicantRecommended";
import Quiz from "./pages/learning/quiz";
import PredictPersonality from "./pages/learning/PredictPersonality";

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = ["/sign-in", "/sign-up"].includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/company-response/:userId" element={<CompanyResponseForm />} />
        <Route path="/learning-progress" element={<LearningProgress />} />
      
        {/* Protected Job Seeker Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Job Seeker"]} />}>
          <Route path="/resume" element={<Resume />} />
          <Route path="/create-resume" element={<CreateResume />} />
          <Route path="/resume-template1" element={<Template1 />} />
          <Route path="/resume-template2" element={<Template2 />} />
          <Route path="/resume-template3" element={<Template3 />} />
          <Route path="/jobs" element={<JobList />} />          
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/recommended-jobs" element={<RecommendedJobs />} />
          <Route path="/applied-jobs" element={<AppliedAllJobs />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning-type-quiz" element={<LearningTypeQuiz />} />
          <Route path="/learning-type" element={<LearningType />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/topic-select" element={<TopicSelect />} />
          <Route path="/personality-test" element={<PersonalityQuiz />} />
          <Route path="/company-details" element={<CompanyDetailsForm />} />
          <Route path="/video-upload/:jobId" element={<VideoUpload />} />
          <Route path="/personality-quiz" element={<Quiz />} />
          <Route path="/personality-category" element={<PredictPersonality />} />
        </Route>

        {/* Protected Recruiter Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Recruiter"]} />}>
          <Route path="/create-job" element={<CreateJobPost />} />
          <Route path="/job-template1" element={<JobTemplate1 />} />
          <Route path="/job-template2" element={<JobTemplate2 />} />
          <Route path="/job-template3" element={<JobTemplate3 />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/dashboard/applicant/job/:jobId" element={<ApplicantResume />} />
          <Route path="/dashboard/applicant/video/:jobId" element={<ApplicantVideo />} />
          <Route path="/dashboard/applicant/recommended/:jobId" element={<ApplicantRecommended />} />
        </Route>

        {/* Catch-All Route for Non-Existent Pages */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideHeaderFooter && <Footers />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
