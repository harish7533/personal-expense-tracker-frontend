import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        {/* HERO SECTION */}
        <section style={{ ...styles.hero, ...styles.fullSection }}>
          <h1 style={styles.heroTitle}>
            Smart Bill Analysis.
            <br />
            Simple. Fast. Secure.
          </h1>
          <p style={styles.heroSubtitle}>
            Upload, analyze, and track your expenses using OCR-powered bill
            processing with role-based insights.
          </p>

          <div style={styles.heroActions}>
            <Link to="/register" style={styles.primaryBtn}>
              Get Started
            </Link>
            <Link to="/login" style={styles.secondaryBtn}>
              Login
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ ...styles.section, ...styles.fullSection }}>
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
        <section style={{ ...styles.section, ...styles.fullSection, background: "var(--card-bg)" }}>
          <h2 style={styles.sectionTitle}>🛠 How It Works</h2>

          <div style={styles.steps}>
            <Step num="1" title="Register & Login" />
            <Step num="2" title="Upload / Create Bills" />
            <Step num="3" title="Analyze Spending" />
            <Step num="4" title="Make Better Decisions" />
          </div>
        </section>

        {/* DEVELOPER INFO */}
        <section style={{ ...styles.section, ...styles.fullSection }}>
          <h2 style={styles.sectionTitle}>👨‍💻 Developer</h2>

          <div style={styles.devCard}>
            <h3>Harish B.</h3>
            <p>Full Stack Developer</p>
            <p>Angular • React • Java • Node.js • MongoDB • OCR • JWT</p>
            <p style={{ marginTop: 10, opacity: 0.8 }}>
              This project demonstrates real-world authentication, role-based
              routing, analytics, and OCR integration.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <p>© {new Date().getFullYear()} Expense Tracker</p>
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
      <p style={{ marginTop: 10 }}>{desc}</p>
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
    background: "var(--bg)",
    color: "var(--text)",
    minHeight: "100vh",
  },

  hero: {
    padding: "120px 24px",
    textAlign: "center",
    background: "linear-gradient(180deg, var(--bg), var(--card-bg))",
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
    color: "var(--muted)",
  },

  heroActions: {
    marginTop: 32,
    display: "flex",
    gap: 16,
    justifyContent: "center",
  },

  primaryBtn: {
    background: "var(--primary)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
  },

  secondaryBtn: {
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "12px 24px",
    borderRadius: 10,
    textDecoration: "none",
  },

  fullSection: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: 24,
  },

  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
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
    background: "var(--primary)",
    color: "#fff",
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
    border: "1px solid var(--border)",
    background: "var(--card-bg)",
    textAlign: "center",
  },

  footer: {
    padding: 24,
    borderTop: "1px solid var(--border)",
    textAlign: "center",
    opacity: 0.7,
    color: "var(--muted)",
  },
};
