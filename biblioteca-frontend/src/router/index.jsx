import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import BooksList from "../pages/Books/BooksList";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="/books" element={<BooksList />} />

      </Routes>
    </BrowserRouter>
  );
}
