import React, { useState } from "react";
import "../Styles/Cadastro.css";
import { getDatabase, ref, push, set } from "firebase/database";
import { app, storage } from "../Services/ConnectionFirebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Corrigido para .css
import InputMask from 'react-input-mask'; // Importa o react-input-mask
import { Link } from 'react-router-dom';

const formatDate = (date) => {
  if (!date) return null;
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

function Cadastro() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [data, setData] = useState(null);
  const [idade, setIdade] = useState("");
  const [contato, setContato] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const saveData = async () => {
    if (!nome || !data) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const db = getDatabase(app);
    const newDocRef = push(ref(db, 'cadastrados'));

    let imageUrl = "";
    if (imageFile) {
      const imageRef = storageRef(storage, `images/${imageFile.name}`);

      try {
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error('Erro ao carregar a imagem: ', error);
      }
    }

    set(newDocRef, {
      Nome: nome,
      Endereco: endereco,
      Data: formatDate(data),
      Idade: idade,
      Contato: contato,
      Responsavel: responsavel,
      Images: imageUrl
    })
    .then(() => {
      alert("Dados salvos com sucesso!");
      setNome("");
      setEndereco("");
      setData(null);
      setIdade("");
      setContato("");
      setResponsavel("");
      setImageFile(null);
    })
    .catch((error) => {
      console.error("Erro ao salvar os dados: ", error);
      alert("Erro: " + error.message);
    });
  };

  return (
    <div className="Body">
      <div className="form-wrapper">
        <div className="mb-1">
          <label htmlFor="nome" className="form-label">
            * Nome:
          </label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />
        </div>
        <div className="mb-1">
          <label htmlFor="idade" className="form-label">
            Idade:
          </label>
          <input
            type="text"
            className="form-control"
            id="idade"
            value={idade}
            onChange={(event) => setIdade(event.target.value)}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="data" className="form-label">
            * Data de Nascimento:
          </label>
          <br />
          <DatePicker
            className="form-control"
            selected={data}
            onChange={(date) => setData(date)}
            dateFormat="dd/MM/yyyy" // Define o formato dia/mês/ano
          />
        </div>
        <div className="mb-1">
          <label htmlFor="endereco" className="form-label">
            Endereço:
          </label>
          <input
            type="text"
            className="form-control"
            id="endereco"
            value={endereco}
            onChange={(event) => setEndereco(event.target.value)}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="contato" className="form-label">
            Contato:
          </label>
          <InputMask
            mask="(99) 99999-9999" // Máscara para o formato de telefone brasileiro
            value={contato}
            onChange={(event) => setContato(event.target.value)}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                type="text"
                className="form-control"
                id="contato"
                placeholder="(99) 99999-9999"
              />
            )}
          </InputMask>
        </div>
        <div className="mb-1">
          <label htmlFor="responsavel" className="form-label">
            Responsável:
          </label>
          <input
            type="text"
            className="form-control"
            id="responsavel"
            value={responsavel}
            onChange={(event) => setResponsavel(event.target.value)}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="images" className="form-label">
            Foto:
          </label>
          <input
            type="file"
            className="form-control"
            id="images"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files[0])}
          />
        </div>
        <button style={{ width: "95%" }} type="submit" className="form-button" onClick={saveData}>
          Enviar
        </button>
        <br />
        <Link className="form-link" to="/">
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}

export default Cadastro;
