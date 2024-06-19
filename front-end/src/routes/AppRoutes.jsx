import React from "react";
import { Routes, Route } from 'react-router-dom'

import HomePage from "../ui/pages/homepage";
import LoginPage from "../ui/pages/loginpage";
import CustomerList from "../ui/pages/customer/CustomerList";
import CustomerForm from "../ui/pages/customer/CustormerForm";
import CarList from "../ui/pages/car/CarList";
import CarForm from "../ui/pages/car/CarForm.jsx";
import Prova from "../ui/pages/prova";
/*
  AuthGuard verifica se o usuário ainda está autenticado
  quando há uma mudança de rota no front-end
*/
import AuthGuard from './AuthGuard'

export default function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<AuthGuard> <HomePage /> </AuthGuard>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/customers" element={<AuthGuard> <CustomerList /> </AuthGuard>} />
      <Route path="/customers/:id" element={<AuthGuard> <CustomerForm /> </AuthGuard>} />
      <Route path="/customers/new" element={<AuthGuard> <CustomerForm /> </AuthGuard>} />
      <Route path="/cars" element={<AuthGuard><CarList /></AuthGuard>} />
      <Route path="/cars/new" element={<AuthGuard><CarForm /></AuthGuard>} />
      <Route path="/cars/:id" element={<AuthGuard><CarForm /></AuthGuard>} />
      <Route path="/prova" element={<AuthGuard><Prova /></AuthGuard>} />
    </Routes>
  )
}