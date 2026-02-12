import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from "./pages/Intro";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz.jsx";
import QuizResult from "./pages/QuizResult";
import Interview from "./pages/Interview";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing / Dashboard */}
        <Route path="/" element={<Intro />} />

        {/* Notes → MCQ */}
        <Route path="/notes" element={<Notes />} />

        {/* Quiz */}
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/result" element={<QuizResult />} />

        {/* Interview */}
        <Route path="/interview" element={<Interview />} />

        {/* User Profile */}
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}
