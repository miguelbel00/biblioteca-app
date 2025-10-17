import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import BooksList from "../pages/Books/BooksList";
import UsersList from "../pages/Users/UsersList";
import LoansList from "../pages/Loans/LoandList";
import Statistics from "../pages/Statistics/Statistics";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/loans" element={<LoansList />} />
        <Route path="/stats" element={<Statistics/>} />

      </Routes>
    </BrowserRouter>
  );
}
