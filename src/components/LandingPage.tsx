import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function LandingPage() {
  return (
    <>
    <Navbar />
    <div style={styles.wrapper}>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Smart Bill Analysis.<br />Simple. Fast. Secure.
        </h1>
        <p style={styles.heroSubtitle}>
          Upload, analyze, and track your expenses using OCR-powered bill
          processing with role-based insights.
        </p>

        <div style={styles.heroActions}>
          <Link to="/login" style={styles.primaryBtn}>Get Started</Link>
          <Link to="/login" style={styles.secondaryBtn}>Login</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🚀 What You Can Do</h2>

        <div style={styles.grid}>
          <Feature
            title="📸 OCR Bill Upload"
            desc="Upload bills from mobile or desktop and extract data automatically."
          />
          <Feature
            title="📊 Analytics Dashboard"
            desc="Visualize expenses daily, monthly, and store-wise (Admin only)."
          />
          <Feature
            title="🔐 Role-Based Access"
            desc="Separate USER and ADMIN flows with protected routes."
          />
          <Feature
            title="⚡ Fast & Secure"
            desc="JWT authentication, secure APIs, and scalable architecture."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ ...styles.section, background: "#111827" }}>
        <h2 style={styles.sectionTitle}>🛠 How It Works</h2>

        <div style={styles.steps}>
          <Step num="1" title="Register & Login" />
          <Step num="2" title="Upload / Create Bills" />
          <Step num="3" title="Analyze Spending" />
          <Step num="4" title="Make Better Decisions" />
        </div>
      </section>

      {/* DEVELOPER INFO */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>👨‍💻 Developer</h2>

        <div style={styles.devCard}>
          <h3>Harish B.</h3>
          <p>Full Stack Developer</p>
          <p>
            Angular • React • Java • Node.js • MongoDB • OCR • JWT
          </p>
          <p style={{ marginTop: 10, opacity: 0.8 }}>
            This project demonstrates real-world authentication,
            role-based routing, analytics, and OCR integration.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Bill Analyzer</p>
        <p>Built with ❤️ using React + Node.js</p>
      </footer>
    </div>
    </>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function Step({ num, title }: { num: string; title: string }) {
  return (
    <div style={styles.step}>
      <div style={styles.stepNum}>{num}</div>
      <p>{title}</p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    fontFamily: "'Inter', system-ui, sans-serif",
    background: "#020617",
    color: "#e5e7eb",
  },

  hero: {
    padding: "120px 24px",
    textAlign: "center",
    background: "linear-gradient(180deg, #020617, #020617cc)",
  },

  heroTitle: {
    fontSize: "42px",
    fontWeight: 800,
    lineHeight: 1.2,
  },

  heroSubtitle: {
    marginTop: 16,
    fontSize: 18,
    maxWidth: 720,
    marginInline: "auto",
    opacity: 0.85,
  },

  heroActions: {
    marginTop: 32,
    display: "flex",
    gap: 16,
    justifyContent: "center",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
  },

  secondaryBtn: {
    border: "1px solid #374151",
    color: "#e5e7eb",
    padding: "12px 24px",
    borderRadius: 10,
    textDecoration: "none",
  },

  section: {
    padding: "80px 24px",
    maxWidth: 1100,
    margin: "0 auto",
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 40,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 24,
  },

  card: {
    background: "#020617",
    border: "1px solid #1f2937",
    borderRadius: 16,
    padding: 20,
  },

  steps: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 24,
  },

  step: {
    textAlign: "center",
    maxWidth: 160,
  },

  stepNum: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#2563eb",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 10px",
    fontWeight: 700,
  },

  devCard: {
    maxWidth: 520,
    margin: "0 auto",
    padding: 24,
    borderRadius: 16,
    border: "1px solid #1f2937",
    background: "#020617",
    textAlign: "center",
  },

  footer: {
    padding: 24,
    borderTop: "1px solid #1f2937",
    textAlign: "center",
    opacity: 0.7,
  },
};
