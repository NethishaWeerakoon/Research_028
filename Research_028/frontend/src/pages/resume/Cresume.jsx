import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import template1 from "../../assets/resume/template1.png";
import template2 from "../../assets/resume/template2.png";
import template3 from "../../assets/resume/template3.png";
import "animate.css/animate.min.css";

const newImageLink =
  "https://img.freepik.com/premium-vector/businesspeople-character-avatar-icon_24877-9432.jpg?w=900";

export default function Cresume() {
  const navigate = useNavigate();
  const templatesRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (templatesRef.current) {
        // Scroll horizontally with a pause at each template for readability
        const scrollAmount = 1;
        const maxScrollLeft =
          templatesRef.current.scrollWidth - templatesRef.current.clientWidth;
        if (templatesRef.current.scrollLeft >= maxScrollLeft) {
          templatesRef.current.scrollLeft = 0;
        } else {
          templatesRef.current.scrollLeft += scrollAmount;
        }
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {/* HEADER */}
        <header className="text-center mb-20 animate__animated animate__fadeInDown">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 leading-tight">
            Just three <span className="text-red-500">easy</span> steps
          </h1>
          <p className="mt-4 text-lg md:text-xl text-purple-800 max-w-3xl mx-auto">
            Follow these steps to build your perfect resume.
          </p>
        </header>

        {/* STEPS */}
        <section className="grid gap-12 md:grid-cols-3 mb-32 animate__animated animate__fadeInUp">
          {[
            {
              no: 1,
              title: "Choose a template",
              desc:
                "Pick from professionally designed templates optimized to pass ATS and impress recruiters.",
            },
            {
              no: 2,
              title: "Enter your info",
              desc:
                "Fill out a guided, step-by-step form with helpful tips from recruitment experts.",
            },
            {
              no: 3,
              title: "Download your resume",
              desc: "Export a polished PDF instantly with a click.",
            },
          ].map((step) => (
            <div
              key={step.no}
              className="backdrop-blur-md bg-white/60 rounded-3xl p-10 shadow-lg hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-default"
              aria-label={`Step ${step.no}: ${step.title}`}
            >
              <div className="text-6xl md:text-7xl font-extrabold text-blue-600 mb-6 select-none">
                {step.no}
              </div>
              <h3 className="text-2xl font-semibold text-purple-900 mb-3">
                {step.title}
              </h3>
              <p className="text-purple-800 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </section>

        {/* TEMPLATE GALLERY */}
        <section className="mb-32 animate__animated animate__fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-12">
            Elevate your search with our templates
          </h2>

          <div
            ref={templatesRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide px-2 md:px-4"
            aria-label="Resume templates carousel"
            role="region"
          >
            {[template1, template2, template3].map((img, idx) => (
              <div
                key={idx}
                className="shrink-0 w-64 md:w-72 lg:w-80 backdrop-blur-md bg-white/60 rounded-3xl p-5 shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                onClick={() => navigate(`/create-resume?template=${idx + 1}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/create-resume?template=${idx + 1}`);
                  }
                }}
                role="button"
                aria-label={`Select template ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`Resume template ${idx + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate("/create-resume")}
              className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold py-4 px-14 rounded-xl shadow-lg transition-transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-400"
              aria-label="Start building my resume"
            >
              Build My Resume
            </button>
          </div>
        </section>

        {/* SMART BUILDER INFO */}
        <section className="flex flex-col md:flex-row items-center gap-14 backdrop-blur-md bg-white/70 rounded-3xl p-12 lg:p-20 shadow-xl animate__animated animate__fadeInUp">
          {/* image */}
          <img
            src={newImageLink}
            alt="Smart CV Builder"
            className="w-full md:w-1/2 rounded-3xl shadow-2xl max-h-96 object-cover object-center"
            loading="lazy"
          />

          {/* text */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-purple-900 mb-8 leading-tight">
              Smart CV Builder &amp; Job Matcher
            </h2>
            <ul className="space-y-3 text-purple-800 leading-relaxed text-lg">
              <li>
                <strong>User Profile Creation&nbsp;–</strong>&nbsp;generate a
                personalised CV from your info.
              </li>
              <li>
                <strong>CV Customisation&nbsp;–</strong>&nbsp;fine-tune the CV
                with recruiter-approved templates.
              </li>
              <li>
                <strong>Job Recommendations&nbsp;–</strong>&nbsp;AI suggests
                roles that fit your profile.
              </li>
              <li>
                <strong>Automatic Alerts&nbsp;–</strong>&nbsp;get notified when
                perfect matches appear.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
