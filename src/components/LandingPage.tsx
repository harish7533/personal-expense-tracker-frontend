/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import Navbar from "./Navbar";
// import "../styles/LandingPage.css";

// export default function LandingPage() {
//   const sectionsRef = useRef<Array<HTMLDivElement | null>>([]);

//   // Scroll animation observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) entry.target.classList.add("fade-slide-in");
//         });
//       },
//       { threshold: 0.15 },
//     );

//     sectionsRef.current.forEach((el) => {
//       if (el) observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, []);

//   const setSectionRef = (index: number) => (el: HTMLDivElement | null) => {
//     sectionsRef.current[index] = el;
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="wrapper">
//         {/* ================= HERO SECTION ================= */}
//         <section
//           ref={setSectionRef(0)}
//           className="hero-section fade-slide-out gradient-bg"
//         >
//           <div className="hero-content">
//             <div className="hero-text">
//               <h1>
//                 Smart Bill Analysis.
//                 <br />
//                 Simple. Fast. Secure.
//               </h1>
//               <p>
//                 Upload, analyze, and track your expenses using OCR-powered bill
//                 processing with role-based insights.
//               </p>
//               <div className="hero-actions">
//                 <Link to="/register" className="primary-btn">
//                   Get Started
//                 </Link>
//                 <Link to="/login" className="secondary-btn">
//                   Login
//                 </Link>
//               </div>
//             </div>
//             <div className="hero-image">
//               <img
//                 src="/assets/hero-dashboard.png"
//                 alt="Dashboard preview"
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </section>

//         {/* ================= FEATURES ================= */}
//         <section
//           ref={setSectionRef(1)}
//           className="feature-section fade-slide-out"
//         >
//           <div className="feature-content">
//             <div className="feature-image">
//               <img
//                 src="/assets/feature-analytics.png"
//                 alt="Analytics"
//                 loading="lazy"
//               />
//             </div>
//             <div className="feature-text">
//               <h2>🚀 What You Can Do</h2>
//               <div className="grid">
//                 <Feature
//                   title="📸 OCR Bill Upload"
//                   desc="Upload bills from mobile or desktop and extract data automatically."
//                 />
//                 <Feature
//                   title="📊 Analytics Dashboard"
//                   desc="Visualize expenses daily, monthly, and store-wise (Admin only)."
//                 />
//                 <Feature
//                   title="🔐 Role-Based Access"
//                   desc="Separate USER and ADMIN flows with protected routes."
//                 />
//                 <Feature
//                   title="⚡ Fast & Secure"
//                   desc="JWT authentication, secure APIs, and scalable architecture."
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ================= HOW IT WORKS ================= */}
//         <section
//           ref={setSectionRef(2)}
//           className="how-section fade-slide-out gradient-bg-alt"
//         >
//           <h2>🛠 How It Works</h2>

//           {/* Floating shapes */}
//           <div className="floating-shapes">
//             <div className="circle"></div>
//             <div className="triangle"></div>
//             <div className="square"></div>
//           </div>

//           {/* Steps with SVG connector */}
//           <div className="steps">
//             <Step
//               num="1"
//               title="Register & Login"
//               icon="/assets/icons/login.svg"
//             />
//             <Step
//               num="2"
//               title="Upload / Create Bills"
//               icon="/assets/icons/upload.svg"
//             />
//             <Step
//               num="3"
//               title="Analyze Spending"
//               icon="/assets/icons/analytics.svg"
//             />
//             <Step
//               num="4"
//               title="Make Better Decisions"
//               icon="/assets/icons/decision.svg"
//             />
//           </div>

//           {/* Accordion FAQ */}
//           <div className="faq">
//             <Accordion
//               question="Can I upload bills from my phone?"
//               answer="Yes, both mobile and desktop uploads are supported with OCR processing."
//             />
//             <Accordion
//               question="How secure is my data?"
//               answer="All data is stored securely using JWT authentication and encrypted storage."
//             />
//             <Accordion
//               question="Can admins view analytics?"
//               answer="Yes, admins have access to detailed dashboards for store-wise and date-wise insights."
//             />
//           </div>
//         </section>

//         {/* ================= DEVELOPER ================= */}
//         <section ref={setSectionRef(3)} className="dev-section fade-slide-out">
//           <div className="dev-content">
//             <div className="dev-image">
//               <img src="/assets/developer.png" alt="Developer" loading="lazy" />
//             </div>
//             <div className="dev-text">
//               <h2>👨‍💻 Developer</h2>
//               <h3>Harish B.</h3>
//               <p>Full Stack Developer</p>
//               <p>Angular • React • Java • Node.js • MongoDB • OCR • JWT</p>
//               <p style={{ marginTop: 10, opacity: 0.8 }}>
//                 This project demonstrates real-world authentication, role-based
//                 routing, analytics, OCR integration, and interactive UI design.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* ================= FOOTER ================= */}
//         <footer className="footer">
//           <p>© {new Date().getFullYear()} Expense Tracker</p>
//           <p>Built with ❤️ using React + Node.js</p>
//         </footer>
//       </div>
//     </>
//   );
// }

// // ================= FEATURE =================
// function Feature({ title, desc }: { title: string; desc: string }) {
//   return (
//     <div className="card">
//       <h3>{title}</h3>
//       <p>{desc}</p>
//     </div>
//   );
// }

// // ================= STEP =================
// function Step({
//   num,
//   title,
//   icon,
// }: {
//   num: string;
//   title: string;
//   icon?: string;
// }) {
//   return (
//     <div className="stepCard">
//       <div className="stepNum">{num}</div>
//       {icon && <img src={icon} alt="" className="step-icon" />}
//       <p>{title}</p>
//     </div>
//   );
// }

// // ================= ACCORDION =================
// function Accordion({ question, answer }: { question: string; answer: string }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="accordion">
//       <div
//         className="accordion-question"
//         onClick={() => setOpen((prev) => !prev)}
//       >
//         {question} <span>{open ? "-" : "+"}</span>
//       </div>
//       {open && <div className="accordion-answer">{answer}</div>}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import "../styles/LandingPage.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

/* ================= STAT COUNTER ================= */
const Stat = ({ number, suffix, label }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = number / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= number) {
        setCount(number);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [number]);

  return (
    <div className="stat-card glass-card">
      <h2>
        {count}
        {suffix}
      </h2>
      <p>{label}</p>
    </div>
  );
};

/* ================= FEATURE CARD ================= */
const Feature = ({ title, desc }: any) => (
  <div className="glass-card feature-card">
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

const LandingPage = () => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };

  /* ================= REVEAL EFFECT ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.15 },
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <div className="landing-wrapper">
        {/* ================= HERO ================= */}
        <section ref={setSectionRef(0)} className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Smart Expense Tracking</h1>
              <p>
                Scan bills instantly. Extract data with OCR. Visualize spending.
              </p>

              <div className="hero-actions">
                <Link to={"/register"} className="btn-primary">
                  Get Started
                </Link>
                <Link to={"/login"} className="btn-secondary">
                  Live Demo
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <h4>Monthly Overview</h4>
              <div className="bars">
                <div style={{ height: "60%" }}></div>
                <div style={{ height: "80%" }}></div>
                <div style={{ height: "45%" }}></div>
                <div style={{ height: "90%" }}></div>
                <div style={{ height: "70%" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="stats-section">
          <div className="stats-header">
            <h2>Trusted by Growing Businesses</h2>
            <p>
              Real-time expense tracking, AI-powered extraction, and scalable
              architecture.
            </p>
          </div>

          <div className="stats-grid">
            <Stat number={12000} suffix="+" label="Bills Processed" />
            <Stat number={540} suffix="+" label="Active Users" />
            <Stat number={99} suffix="%" label="OCR Accuracy" />
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section ref={setSectionRef(1)} className="section feature-section">
          <div className="floating-shapes">
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
          </div>

          <div className="feature-content">
            <div className="feature-text">
              <h2>Powerful Features Built for Real Users</h2>
              <p>
                Designed like a real SaaS product with secure authentication,
                AI-powered OCR, and insightful analytics.
              </p>

              <div className="feature-grid">
                <Feature
                  title="📸 OCR Extraction"
                  desc="Extract bill text instantly."
                />
                <Feature
                  title="📊 Advanced Analytics"
                  desc="Store & monthly insights."
                />
                <Feature
                  title="🔐 Secure JWT Auth"
                  desc="Protected routes & APIs."
                />
                <Feature
                  title="⚡ Scalable Backend"
                  desc="Modular Node architecture."
                />
              </div>
            </div>

            <div className="feature-image">
              <img
                src="https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800"
                alt="Analytics Dashboard"
                className="analytics-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ================= DEVELOPER ================= */}
        {/* <section ref={setSectionRef(2)} className="section-center">
          <div className="developer-card">
            <img
              src="https://images.unsplash.com/photo-1502767089025-6572583495b4?w=300"
              alt="Developer"
            />
            <div>
              <h3>Built by Harish B</h3>
              <p>
                Full-stack developer focused on scalable SaaS architecture,
                Angular + Node ecosystems, and AI integrations.
              </p>
            </div>
          </div>
        </section> */}

        {/* ================= FAQ ================= */}
        <section ref={setSectionRef(3)} className="faq-section">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about the platform.</p>
          </div>

          <div className="faq-grid">
            <details className="faq-item">
              <summary>
                How accurate is the system?
                <span>+</span>
              </summary>
              <div className="faq-content">
                Our system delivers up to 99% accuracy depending on input
                quality and clarity.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Is my data secure?
                <span>+</span>
              </summary>
              <div className="faq-content">
                We use secure authentication, encrypted storage, and protected
                APIs to safeguard your data.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Can it scale for business use?
                <span>+</span>
              </summary>
              <div className="faq-content">
                Yes. The modular backend architecture is designed for SaaS-level
                scalability.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Is it mobile friendly?
                <span>+</span>
              </summary>
              <div className="faq-content">
                Fully responsive and optimized for desktop, tablet, and mobile.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Does it support role-based access?
                <span>+</span>
              </summary>
              <div className="faq-content">
                Yes. Different user roles can have custom permissions and
                restricted access.
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Is integration simple?
                <span>+</span>
              </summary>
              <div className="faq-content">
                REST APIs and modular components make integration seamless.
              </div>
            </details>
          </div>
        </section>

        {/* ================= DEVELOPER ================= */}
        <section ref={setSectionRef(2)} className="section developer-section">
          <div className="developer-card">
            <div className="developer-avatar-wrapper">
              <div className="avatar-ring"></div>
              <img
                className="developer-avatar"
                // src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                src="../src/assets/developer.jpg"
                alt="Harish B"
              />
            </div>

            <div className="developer-info">
              <h3>Harish B</h3>
              <span className="developer-role">
                Full Stack Developer • AI & SaaS Architecture
              </span>

              <p>
                Passionate about building scalable SaaS products using Angular,
                Node.js, TypeScript, and AI integrations. Focused on
                performance, clean architecture, and premium UI experiences.
              </p>

              <div className="developer-actions">
                <a href="#" className="dev-btn primary">
                  View Portfolio
                </a>
                <a href="#" className="dev-btn secondary">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          © 2026 ExpenseTracker - Built with precision.
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
