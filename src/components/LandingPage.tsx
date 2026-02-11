import { useEffect, useRef, useState } from "react";
import "../styles/LandingPage.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

/* ================= ADVANCED TYPEWRITER ================= */
function useLoopTypewriter(
  words: string[],
  speed = 80,
  delayAfterComplete = 5000,
  trigger = true,
) {
  const [text, setText] = useState<string>("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    const currentWord = words[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          setText(currentWord.substring(0, text.length + 1));

          if (text === currentWord) {
            // Wait 5 seconds before deleting
            setTimeout(() => {
              setFade(true);
              setIsDeleting(true);
            }, delayAfterComplete);
          }
        } else {
          // Deleting
          setText(currentWord.substring(0, text.length - 1));

          if (text === "") {
            setFade(false);
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed,
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, delayAfterComplete, trigger]);

  return { text, fade };
}

/* ================= STAT CARD ================= */
interface StatProps {
  number: number;
  suffix: string;
  label: string;
}

const Stat = ({ number, suffix, label }: StatProps) => {
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
        setCount(Number(start.toFixed(0)));
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
interface FeatureProps {
  title: string;
  desc: string;
}

const Feature = ({ title, desc }: FeatureProps) => (
  <div className="glass-card feature-card">
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

/* ================= LANDING PAGE ================= */
const LandingPage = () => {
  /* ================= HERO VISIBILITY ================= */
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );

    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  /* ================= SECTION REFS ================= */
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

  /* ================= TYPEWRITER ================= */
  const heroWords = [
    "Smart Expense Tracking",
    "Your Finances sorted",
    "Track Save Repeat",
  ];

  const overviewWords = [
    "Monthly Overview",
    "Daily Overview",
    "Store Analysis",
  ];

  // const heroTitle = useLoopTypewriter(
  //   heroWords,
  //   80, // slower typing speed
  //   5000, // wait 5 seconds before deleting
  //   heroVisible,
  // );

  // const overviewText = useLoopTypewriter(overviewWords, 80, 5000, heroVisible);

  const { text: heroText, fade: heroFade } = useLoopTypewriter(
    heroWords,
    80,
    5000,
    heroVisible,
  );

  const { text: overviewText, fade: overviewFade } = useLoopTypewriter(
    overviewWords,
    80,
    5000,
    heroVisible,
  );

  const barData: Record<string, number[]> = {
    "Monthly Overview": [60, 80, 45, 90, 70],
    "Daily Overview": [40, 55, 35, 60, 50],
    "Store Analysis": [70, 50, 80, 65, 75],
  };

  const currentBars =
    barData[overviewText as keyof typeof barData] ??
    barData["Monthly Overview"];

  return (
    <>
      <Navbar />

      <div className="landing-wrapper">
        {/* ================= HERO ================= */}
        <section ref={heroRef} className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className={`typing-text ${heroFade ? "fade-delete" : ""}`}>
                {" "}
                {heroText}
                <span className="cursor">|</span>
              </h1>

              <p>
                Scan bills instantly. Extract data with OCR. Visualize spending
                patterns. Make smarter financial decisions.
              </p>

              <div className="hero-actions">
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn-secondary">
                  Live Demo
                </Link>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="dashboard-card">
              <h4
                className={`typing-text small ${overviewFade ? "fade-delete" : ""}`}
              >
                {" "}
                {overviewText}
                <span className="cursor small">|</span>
              </h4>

              <div className="bars">
                {currentBars.map((height, i) => (
                  <div key={i} style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="stats-section">
          <div className="stats-header">
            <h2>Trusted by Growing Businesses</h2>
            <p>
              Real-time expense tracking, structured extraction, and scalable
              architecture.
            </p>
          </div>

          <div className="stats-grid">
            <Stat number={1000} suffix="+" label="Bills Processed" />
            <Stat number={528} suffix="+" label="Active Users" />
            <Stat number={99.9} suffix="%" label="OCR Accuracy" />
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section ref={setSectionRef(0)} className="section feature-section">
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
        Our system delivers up to 99% accuracy depending on input quality and clarity.
      </div>
    </details>

    <details className="faq-item">
      <summary>
        Is my data secure?
        <span>+</span>
      </summary>
      <div className="faq-content">
        We use secure authentication, encrypted storage, and protected APIs to safeguard your data.
      </div>
    </details>

    <details className="faq-item">
      <summary>
        Can it scale for business use?
        <span>+</span>
      </summary>
      <div className="faq-content">
        Yes. The modular backend architecture is designed for SaaS-level scalability.
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
        Yes. Different user roles can have custom permissions and restricted access.
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
          <div className="developer-container">
            <div className="developer-card">
              <div className="developer-avatar-wrapper">
                <div className="avatar-ring"></div>
                <img
                  className="developer-avatar"
                  src="https://images.unsplash.com/photo-1750535135685-7d3322ba2e36?q=80&w=880"
                  alt="Harish B"
                />
              </div>

              <div className="developer-info">
                <h2 className="developer-name">Harish B</h2>
                <span className="developer-role">
                  Full Stack Developer • AI SaaS Engineer
                </span>

                <p className="developer-description">
                  I build production-ready SaaS applications using Angular,
                  Node.js, TypeScript and AI integrations.
                </p>
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
