import React from 'react';
import { Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import fundoHome from '../img/FundoHome.jpg'; // Import the image

import '../Styles/Home.css';

function Home() {
  const navigate = useNavigate();

  const TelaDeCadastro = () => {
    navigate('/Cadastrar');
  };

  const TelaDeBusca = () => {
    navigate('/Buscar');
  };

  const TelaDePresencas = () => {
    navigate('/Presenças');
  };

  return (
    <div>
      <Container className='HomeContent'>
        <Container className='ContentSection'>
          <Container className='ContainerCadastro'>
            <h2>Tela de Cadastro</h2>
            <br/>
            <button onClick={TelaDeCadastro} className='home-button'>Ir para Tela de Cadastro</button>
          </Container>
          <Container className='ContainerBusca'>
            <h2>Tela de Busca</h2>
            <br/>
            <button onClick={TelaDeBusca} className='home-button'>Ir para Tela de Busca</button>
          </Container>
          <Container className='ContainerPresenca'>
            <h2>Tela de Presença</h2>
            <br/>
            <button onClick={TelaDePresencas} className='home-button'>Ir para Tela de Presença</button>
          </Container>
        </Container>
        <div className='ImageSection'>
          <Image src={fundoHome} rounded fluid />
        </div>
      </Container>
    </div>  
  );
}

export default Home;
