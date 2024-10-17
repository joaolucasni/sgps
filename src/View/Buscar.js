import '../Styles/Buscar.css';
import React, { useState, useEffect } from 'react';
import { ref, query, orderByChild, get, remove } from 'firebase/database'; // Import 'remove'
import { database } from '../Services/ConnectionFirebase';
import { Link } from 'react-router-dom';
import { Card, Row, Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Buscar() {
  const [searchInput, setSearchInput] = useState("");
  const [atendidos, setAtendidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInput) {
      search();
    }
  }, [searchInput]);

  async function search() {
    if (!searchInput) {
      console.log("Por favor, insira um nome para buscar.");
      return;
    }
  
    setLoading(true);
  
    const dbRef = ref(database, 'cadastrados');
    const queryRef = query(dbRef, orderByChild('Nome'));
  
    try {
      const snapshot = await get(queryRef);
      if (snapshot.exists()) {
        const atendidosData = Object.entries(snapshot.val()).map(([id, atendido]) => ({
          id,  // Captura a chave única do Firebase
          ...atendido
        }));
  
        console.log("Dados recebidos do Firebase:", atendidosData);
  
        const lowerCaseSearchInput = searchInput.toLowerCase();
  
        const updatedAtendidos = atendidosData.map((atendido) => {
          const lowerCaseName = atendido.Nome.toLowerCase();
  
          if (lowerCaseName.includes(lowerCaseSearchInput)) {
            const imageUrl = atendido.Images || 'error.png'; // Default image if not found
            return { ...atendido, imageUrl };
          }
          return null;
        }).filter((atendido) => atendido !== null);
  
        console.log("Dados filtrados:", updatedAtendidos);
  
        setAtendidos(updatedAtendidos);
      } else {
        console.log("Nenhum dado encontrado.");
        setAtendidos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }
  

  // Função para excluir o item do banco de dados
  async function handleDelete(atendido) {
    if (window.confirm(`Tem certeza de que deseja excluir ${atendido.Nome}?`)) {
      const dbRef = ref(database, `cadastrados/${atendido.id}`);  // Use a chave (ID) do Firebase
      try {
        await remove(dbRef);
        console.log(`${atendido.Nome} foi excluído do banco de dados.`);
        setAtendidos(atendidos.filter(a => a.id !== atendido.id));  // Atualiza a lista sem o item excluído
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  }
  

  const itemsPerPage = 3;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = atendidos.slice(startIndex, endIndex);

  return (
    <Container className='content'>
      <Button className='back-button' onClick={() => navigate('/')}>Home</Button>
      <div className='search-bar'>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Insira o nome do atendido"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </InputGroup>
      </div>
      <Container className='results'>
        <Row className="mx-2 row row-cols-1 row-cols-md-3">
          {currentItems.length > 0 ? (
            currentItems.map((atendido, i) => (
              <Card key={i} className="mb-4">
                <Card.Img variant="top" src={atendido.imageUrl} alt={atendido.Nome} />
                <Card.Body id="Informacoes">
                  <Card.Title>Nome: {atendido.Nome}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Responsável: {atendido.Responsavel}</Card.Subtitle>
                  <Card.Text>Contato: {atendido.Contato}</Card.Text>
                  <br/>
                  <Link className='Link' to={`/Ficha/${atendido.Nome}`}>Detalhes</Link>
                  {/* Botão de exclusão */}
                  <Button variant="danger" onClick={() => handleDelete(atendido)} className="mt-2">
                    Excluir
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div>Nenhum resultado encontrado.</div>
          )}
        </Row>
        <div className="pagination-controls">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Anterior
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={endIndex >= atendidos.length}
          >
            Próximo
          </Button>
        </div>
      </Container>
    </Container>
  );
}

export default Buscar;
