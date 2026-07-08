import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from "./pages/Intro";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz.jsx";
import QuizResult from "./pages/QuizResult";
import Interview from "./pages/Interview";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Flashcards from "./pages/Flashcards";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing / Dashboard */}
        <Route path="/" element={<Intro />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Notes → MCQ */}
        <Route path="/notes" element={<Notes />} />

        {/* Quiz */}
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/result" element={<QuizResult />} />

        {/* Interview */}
        <Route path="/interview" element={<Interview />} />

        {/* User Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Password Reset */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Flashcards */}
        <Route path="/flashcards" element={<Flashcards />} />

      </Routes>
    </BrowserRouter>
  );
}
