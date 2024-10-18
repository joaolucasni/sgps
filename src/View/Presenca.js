import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";  // Apenas essas funções são necessárias
import { database } from "../Services/ConnectionFirebase";  // Importando a instância correta
import "../Styles/Presenca.css";
import { Link } from 'react-router-dom';
import { format } from "date-fns"; // Para formatar a data

function Presenca() {
  const [registros, setRegistros] = useState([]);
  const [presencas, setPresencas] = useState({});

  useEffect(() => {
    const registrosRef = ref(database, 'cadastrados');  // Usando o database direto da conexão

    onValue(registrosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .filter(registro => registro.Nome && registro.Nome.trim() !== '');

        lista.sort((a, b) => a.Nome.localeCompare(b.Nome));
        setRegistros(lista);
      } else {
        setRegistros([]);
      }
    });
  }, []);

  const handleCheckboxChange = (id) => {
    setPresencas((prevPresencas) => ({
      ...prevPresencas,
      [id]: !prevPresencas[id],
    }));
  };

  const savePresencas = () => {
    const hoje = format(new Date(), "dd-MM-yyyy");

    registros.forEach((registro) => {
      const presencaAtual = presencas[registro.id] || false;

      update(ref(database, `presencas/${hoje}/${registro.Nome}`), {
        Presente: presencaAtual,
      }).catch((error) => {
        console.error("Erro ao salvar chamada: ", error);
      });
    });

    alert("Presenças salvas com sucesso!");
  };

  return (
    <div className="Body">
      <div className="list-wrapper">
        <h2>Lista de chamada</h2>
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
        <Link className="form-link" to="/ListarPresencas">
          Listar Presenças
        </Link>
      </div>
    </div>
  );
}

export default Presenca;
