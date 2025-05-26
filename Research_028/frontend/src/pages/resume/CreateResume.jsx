import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import "animate.css/animate.min.css";

/* template previews */
import template1 from "../../assets/resume/template1.png";
import template2 from "../../assets/resume/template2.png";
import template3 from "../../assets/resume/template3.png";

export default function CreateResumeFast() {
  const navigate = useNavigate();

  const [quizResults, setQuizResults] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  /* react-hook-form setup */
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      /* personal */
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      experienceYears: "",
      /* links */
      github: "",
      linkedin: "",
      portfolio: "",
      /* arrays */
      education: [{ degree: "", institution: "", timeRange: "" }],
      workExperience: [{ position: "", company: "", timeRange: "" }],
      /* big text areas */
      technicalSkills: "",
      softSkills: "",
      interests: "",
      languages: "",
    },
  });

  /* dynamic arrays */
  const eduArray = useFieldArray({ control, name: "education" });
  const workArray = useFieldArray({ control, name: "workExperience" });

  /* load draft from localStorage */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ResumeData"));
    if (saved) reset(saved);
  }, [reset]);

  /* fetch quiz results on mount */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
      setLoadingQuiz(false);
      return;
    }
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${user._id}`
        );
        if (response.data && response.data.results) {
          setQuizResults(response.data.results);
        }
      } catch (err) {
        console.error("Error fetching quiz results:", err);
      } finally {
        setLoadingQuiz(false);
      }
    };
    fetchQuizResults();
  }, []);

  /* prettify filename helper */
  const prettifyFilename = (filename) => {
    if (!filename) return "";
    const nameWithoutExt = filename.replace(".pdf", "");
    const nameWithoutTutorial = nameWithoutExt.replace("_tutorial", "");
    return nameWithoutTutorial.replace(/_/g, " ");
  };

  /* submit handler */
  const onSubmit = async (data) => {
    const join = (arr, m) => arr.map(m).join(", ");

    const summary = `
      Skills: ${data.technicalSkills.replace(/,/g, ", ")}.
      Soft Skills: ${data.softSkills.replace(/,/g, ", ")}.
      Interests: ${data.interests.replace(/,/g, ", ")}.
      Languages: ${data.languages.replace(/,/g, ", ")}.
      Education: ${join(
        data.education,
        (d) => `${d.degree} from ${d.institution} (${d.timeRange})`
      )}.
      Work Experience: ${join(
        data.workExperience,
        (w) => `${w.position} at ${w.company} (${w.timeRange})`
      )}.
    `;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}resumes/create-resume-text`,
        { resumeSummary: summary, experienceYears: data.experienceYears },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      Swal.fire({
        icon: "success",
        text: "Resume created!",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Go to Jobs",
        reverseButtons: true,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/jobs");
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response?.data?.error || "Something went wrong.",
      });
    }
  };

  const pickTemplate = (tpl) => {
    localStorage.setItem("ResumeData", JSON.stringify(getValues()));
    navigate(`/resume-${tpl}`);
  };

  const clearAll = () => {
    localStorage.removeItem("ResumeData");
    reset();
  };

  /* Card wrapper */
  const Card = ({ title, children }) => (
    <div className="backdrop-blur-md bg-white/60 rounded-3xl shadow-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-purple-900">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <h1 className="text-center text-4xl font-extrabold text-purple-900 mb-12">
          Build Your Resume 
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* top grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* contact */}
            <Card title="Contact">
              {[
                "firstName",
                "lastName",
                "email",
                "contactNumber",
                "experienceYears",
              ].map((name) => (
                <input
                  key={name}
                  placeholder={name.replace(/([A-Z])/g, " $1")}
                  {...register(name, { required: true })}
                  className="w-full rounded-lg border-2 border-purple-300 p-2 mb-2"
                />
              ))}
            </Card>

            {/* links */}
            <Card title="Links">
              {["github", "linkedin", "portfolio"].map((name) => (
                <input
                  key={name}
                  placeholder={`${name} link`}
                  {...register(name)}
                  className="w-full rounded-lg border-2 border-purple-300 p-2 mb-2"
                />
              ))}
            </Card>
          </div>

          {/* education */}
          <Card title="Education">
            {eduArray.fields.map((field, index) => (
              <div key={field.id} className="grid gap-2 md:grid-cols-3 mb-4">
                <input
                  placeholder="Degree"
                  {...register(`education.${index}.degree`, { required: true })}
                  className="col-span-1 rounded-lg border border-purple-300 p-2"
                />
                <input
                  placeholder="Institution"
                  {...register(`education.${index}.institution`, {
                    required: true,
                  })}
                  className="col-span-1 rounded-lg border border-purple-300 p-2"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="Time Range"
                    {...register(`education.${index}.timeRange`, {
                      required: true,
                    })}
                    className="flex-1 rounded-lg border border-purple-300 p-2"
                  />
                  <button
                    type="button"
                    onClick={() => eduArray.remove(index)}
                    className="text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                eduArray.append({ degree: "", institution: "", timeRange: "" })
              }
              className="text-sm text-purple-700 hover:underline"
            >
              + Add Education
            </button>
          </Card>

          {/* work experience */}
          <Card title="Work Experience">
            {workArray.fields.map((field, index) => (
              <div key={field.id} className="grid gap-2 md:grid-cols-3 mb-4">
                <input
                  placeholder="Position"
                  {...register(`workExperience.${index}.position`)}
                  className="col-span-1 rounded-lg border border-purple-300 p-2"
                />
                <input
                  placeholder="Company"
                  {...register(`workExperience.${index}.company`)}
                  className="col-span-1 rounded-lg border border-purple-300 p-2"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="Time Range"
                    {...register(`workExperience.${index}.timeRange`)}
                    className="flex-1 rounded-lg border border-purple-300 p-2"
                  />
                  <button
                    type="button"
                    onClick={() => workArray.remove(index)}
                    className="text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                workArray.append({ position: "", company: "", timeRange: "" })
              }
              className="text-sm text-purple-700 hover:underline"
            >
              + Add Work
            </button>
          </Card>

          {/* skills / interests */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card title="Skills">
              <textarea
                {...register("technicalSkills", { required: true })}
                placeholder="Technical skills, comma separated"
                className="w-full h-24 rounded-lg border-2 border-purple-300 p-2"
              />
              <textarea
                {...register("softSkills", { required: true })}
                placeholder="Soft skills, comma separated"
                className="w-full h-24 rounded-lg border-2 border-purple-300 p-2"
              />
            </Card>
            <Card title="Interests & Languages">
              <textarea
                {...register("interests", { required: true })}
                placeholder="Interests"
                className="w-full h-24 rounded-lg border-2 border-purple-300 p-2"
              />
              <textarea
                {...register("languages", { required: true })}
                placeholder="Languages"
                className="w-full h-24 rounded-lg border-2 border-purple-300 p-2"
              />
            </Card>
          </div>

          {/* quiz results section */}
          <div className="mt-10">
            <Card title="Quiz Results">
              {loadingQuiz ? (
                <p className="text-center text-purple-700">Loading quiz results...</p>
              ) : quizResults ? (
                <>
                  <p className="text-lg mb-2">
                    Learning Type Score - {quizResults.learningTypePoints}
                  </p>
                  <p className="text-lg mb-4">Learning Type - {quizResults.learningType}</p>

                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                            Topic
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                            Technical Quiz Score
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                            Time Taken (s)
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                            Correct Answers
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                            Total Questions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizResults.quizAttempts.map((quiz, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border border-gray-300">
                              {prettifyFilename(quiz.filename) || "N/A"}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">{quiz.score}</td>
                            <td className="px-4 py-2 border border-gray-300">{quiz.timeTaken}</td>
                            <td className="px-4 py-2 border border-gray-300">{quiz.correctAnswers}</td>
                            <td className="px-4 py-2 border border-gray-300">{quiz.totalQuestions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-600 mt-4">You have not attempted the quiz yet.</p>
              )}
            </Card>
          </div>

          {/* action buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-10">
            <button
              type="button"
              onClick={clearAll}
              className="w-full md:w-64 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-md"
            >
              Clear All
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-64 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl shadow-md"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>

        {/* template picker */}
        <section className="mt-20 text-center animate__animated animate__fadeInUp">
          <h2 className="text-3xl font-bold text-purple-900 mb-6">
            Pick a Template
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["template1", "Simple", template1],
              ["template2", "ATS Friendly", template2],
              ["template3", "Modern", template3],
            ].map(([key, label, img]) => (
              <div
                key={key}
                className="backdrop-blur-md bg-white/60 rounded-3xl shadow-xl overflow-hidden hover:-translate-y-1 transition"
              >
                <img
                  src={img}
                  alt={label}
                  className="w-full h-80 object-cover cursor-pointer"
                  onClick={() => pickTemplate(key)}
                />
                <button
                  onClick={() => pickTemplate(key)}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 font-semibold"
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
