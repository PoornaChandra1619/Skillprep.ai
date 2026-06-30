import Navbar from "../components/Navbar";

export default function Flashcards() {
  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header>
          <div className="inner">
            <h2>Flashcards 🧠</h2>
            <p>Active revision tool (Coming Soon).</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "100px 0" }}>
            <h3 className="major">Feature Under Development</h3>
            <p style={{ opacity: 0.6 }}>We are building a smart spaced-repetition flashcard deck system to help you memorize critical tech terminology. Stay tuned!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
