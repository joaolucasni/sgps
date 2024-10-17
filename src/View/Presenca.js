import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "../Services/ConnectionFirebase";
import "../Styles/Presenca.css";
import { Link } from 'react-router-dom';
import { format } from "date-fns"; // Para formatar a data

function Presenca() {
  const [registros, setRegistros] = useState([]);
  const [presencas, setPresencas] = useState({});

  useEffect(() => {
    const db = getDatabase(app);
    const registrosRef = ref(db, 'cadastrados');

    onValue(registrosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          // Filtrar registros que possuem campos obrigatórios preenchidos
          .filter(registro => registro.Nome && registro.Nome.trim() !== '');

        // Ordenar a lista por nome em ordem alfabética
        lista.sort((a, b) => a.Nome.localeCompare(b.Nome));
        
        setRegistros(lista);
      } else {
        setRegistros([]);
      }
    });
  }, []);

  // Função para marcar presença
  const handleCheckboxChange = (id) => {
    setPresencas((prevPresencas) => ({
      ...prevPresencas,
      [id]: !prevPresencas[id],
    }));
  };

  // Função para salvar presenças no banco de dados
  const savePresencas = () => {
    const db = getDatabase(app);
    const hoje = format(new Date(), "dd/MM/yyyy");

    registros.forEach((registro) => {
      const presencaAtual = presencas[registro.id] || false;

      // Atualizar a presença no banco de dados com a data de hoje
      update(ref(db, `cadastrados/${registro.id}/Presenca/${hoje}`), {
        presente: presencaAtual,
      }).catch((error) => {
        console.error("Erro ao salvar presença: ", error);
      });
    });

    alert("Presenças salvas com sucesso!");
  };

  return (
    <div className="Body">
      <div className="list-wrapper">
        <h2>Lista de Registros</h2>
        <ul className="list-group">
          {registros.map((registro) => (
            <li key={registro.id} className="list-item">
              <strong>Nome:</strong> {registro.Nome} <br />
              <input
                type="checkbox"
                checked={!!presencas[registro.id]}
                onChange={() => handleCheckboxChange(registro.id)}
              />
              <Link className='Link' to={`/Ficha/${registro.Nome}`}>Detalhes</Link>
            </li>
          ))}
        </ul>
        <button className="form-button" onClick={savePresencas}>
          Salvar Presenças
        </button>
        <Link className="form-link" to="/">
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}

export default Presenca;
