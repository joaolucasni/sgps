import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './View/Login';
import Home from './View/Home';
import Cadastro from './View/Cadastro';
import Buscar from './View/Buscar';
import Ficha from './View/Ficha';
import Presenca from './View/Presenca';
import ListarPresenca from './View/ListarPresenca';
import './App.css';


export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />;
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cadastrar" element={<Cadastro />} />
          <Route path="/Buscar" element={<Buscar />} />
          <Route path="/Ficha/:nome" element={<Ficha/>} />
          <Route path="/Presenças" element={<Presenca/>} />
          <Route path="/ListarPresencas" element={<ListarPresenca/>} />
        </Routes>
      </div>
    </Router>
  );
}
