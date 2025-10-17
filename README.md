# 📚 Sistema de Biblioteca con Laravel 12 + React 19 + Vite

Este proyecto consiste en una aplicación web para la gestión de una biblioteca, desarrollada con **Laravel 12** para el backend y **React 19 + Vite** para el frontend.

---

## 🧱 Estructura del Proyecto

- `biblioteca-backend/` → API RESTful con Laravel 12
- `biblioteca-frontend/` → Interfaz de usuario con React 19 + Vite

---

## 🚀 Funcionalidades

- CRUD de libros (título, autor, género, disponibilidad)
- Gestión de préstamos (usuarios, fechas, reglas)
- Estadísticas personalizadas
- Validaciones y pruebas básicas
- Diseño responsivo y accesible

---

## 👨‍💻 Tecnologías y dependencias

### Backend (Laravel 12)
- PHP ^8.2
- `laravel/framework` ^12.0
- `laravel/tinker` ^2.10.1
- `laravel/sail`, `laravel/pint`, `laravel/pail`
- `phpunit/phpunit` ^11.5.3
- `fakerphp/faker` ^1.23

### Frontend (React 19 + Vite)
- React ^19.1.1
- Vite ^7.1.7
- ESLint ^9.36.0
- `@vitejs/plugin-react`
- `@types/react`, `@types/react-dom`

---

## 📥 Instalación

### Backend (Laravel)
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
``