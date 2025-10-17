import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // íconos modernos (instala con: npm i lucide-react)

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const linkBase =
    "block py-2 px-4 rounded-md text-wood-light hover:bg-wood-accent/20 transition-all duration-200";

  const linkActive = "bg-wood-accent/30 text-white font-semibold";

  return (
    <nav className="bg-wood-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <NavLink
            to="/"
            className="text-2xl font-bold tracking-wide text-wood-light hover:text-wood-medium transition-colors"
          >
             Biblioteca
          </NavLink>


          <button
            onClick={toggleMenu}
            className="md:hidden text-wood-light focus:outline-none"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="hidden md:flex space-x-4">
            <NavLink
              to="/books"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Books
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/loans"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Loans
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Statistics
            </NavLink>
          </div>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {open && (
        <div className="md:hidden bg-wood-dark border-t border-wood-medium">
          <div className="flex flex-col space-y-1 p-4">
            <NavLink
              to="/books"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Books
            </NavLink>
            <NavLink
              to="/users"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/loans"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Loans
            </NavLink>
            <NavLink
              to="/stats"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Statistics
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
