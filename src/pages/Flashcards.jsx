import Navbar from "../components/Navbar";

export default function Flashcards() {
  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header style={{ backgroundImage: `url('/images/pic04.jpg')` }}>
          <div className="inner">
            <h2 className="bebas-font">Flashcards</h2>
            <p>Active revision tool (Coming Soon).</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "80px 0" }}>
            <div className="glass-card">
              <h3 className="bebas-font" style={{ fontSize: "2rem", color: "var(--brand-red)", marginBottom: "20px" }}>Feature Under Development</h3>
              <p style={{ opacity: 0.8, fontSize: "16px", lineHeight: "1.6" }}>We are building a smart spaced-repetition flashcard deck system to help you memorize critical tech terminology. Stay tuned!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
