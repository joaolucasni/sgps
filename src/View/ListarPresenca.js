import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";  // Apenas essas funções são necessárias
import { database } from "../Services/ConnectionFirebase";  // Usando o database exportado
import "../Styles/ListarPresenca.css";
import { Link } from 'react-router-dom';

function ListarPresenca() {
  const [datas, setDatas] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState('');

  useEffect(() => {
    const presencasRef = ref(database, 'presencas');  // Usando o database direto da conexão

    onValue(presencasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaDatas = Object.keys(data); // Pega as datas das presenças
        setDatas(listaDatas); // Popula o combobox
      }
    });
  }, []);

  const buscarPresencasPorData = (data) => {
    const presencasRef = ref(database, `presencas/${data}`);

    onValue(presencasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaPresencas = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }));
        setPresencas(listaPresencas);
      } else {
        setPresencas([]);
      }
    });
  };

  return (
    <div className="Body">
      <div className="list-wrapper">
        <h2>Lista de Presenças</h2>

        <div className="combobox-wrapper">
          <label htmlFor="datas">Selecione a Data:</label>
          <select
            id="datas"
            className="form-control"
            value={dataSelecionada}
            onChange={(e) => {
              setDataSelecionada(e.target.value);
              buscarPresencasPorData(e.target.value);
            }}
          >
            <option value="">Selecione uma data</option>
            {datas.map((data, index) => (
              <option key={index} value={data}>
                {data}
              </option>
            ))}
          </select>
        </div>

        <ul className="list-group">
          {presencas.length === 0 && <li className="list-item">Nenhuma presença encontrada para essa data.</li>}
          {presencas.map((presenca) => (
            <li key={presenca.id} className="list-item">
              <strong>Nome:</strong> {presenca.id} <br />
              <strong>Presente:</strong> {presenca.Presente ? "Sim" : "Não"}
            </li>
          ))}
        </ul>

        <Link className="form-link" to="/">
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}

export default ListarPresenca;
