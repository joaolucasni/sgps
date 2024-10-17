import React, { useEffect, useState } from 'react';
import "../Styles/Ficha.css";
import { useParams, useNavigate } from 'react-router-dom';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../Services/ConnectionFirebase';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

function Ficha() {
  const { nome } = useParams();
  const [atendido, setAtendido] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAtendido = async () => {
      setLoading(true);
      const dbRef = ref(database, 'cadastrados');
      const queryRef = query(dbRef, orderByChild('Nome'), equalTo(nome));

      try {
        const snapshot = await get(queryRef);
        if (snapshot.exists()) {
          const atendidoData = Object.values(snapshot.val())[0]; // Assume apenas um resultado
          setAtendido(atendidoData);
        } else {
          console.log("Atendido não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAtendido();
  }, [nome]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!atendido) {
    return <div>Atendido não encontrado.</div>;
  }

  return (
    <Container id='background'>
      <Button className='back-button' onClick={() => navigate('/')}>Voltar</Button>
      <Card id='content'>
        <Row>
          <Col md={4}>
            <Card.Img variant="top" src={atendido.Images || 'error.png'} alt={atendido.Nome} />
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Text>Nome: {atendido.Nome}</Card.Text>
              <Card.Text>Data de Nascimento: {atendido.Data}</Card.Text>
              <Card.Text>Idade: {atendido.Idade}</Card.Text>
              <Card.Text>Endereço: {atendido.Endereco}</Card.Text>
              <Card.Subtitle className="mb-2 text-muted">Nome do responsável: {atendido.Responsavel}</Card.Subtitle>
              <Card.Text>Contato: {atendido.Contato}</Card.Text>
              {/* Adicione mais detalhes do atendido aqui */}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default Ficha;
