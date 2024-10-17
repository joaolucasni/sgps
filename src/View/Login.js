import "../Styles/Login.css"; 
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, auth } from "../Services/ConnectionFirebase";

export default function Login({ changeStatus }) {
    const [type, setType] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    function handleLogin() {
        if (email !== "") {
            if (email.includes("@")) {
                if (password.length >= 6) {
                    if (type === "login") {
                        // Realiza o login
                        signInWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                changeStatus(userCredential.user.uid);
                            })
                            .catch((err) => {
                                console.log(err);
                                alert("Email ou senha não cadastrados!");
                                return;
                            });
                    } else {
                        // Realiza o cadastro
                        createUserWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                changeStatus(userCredential.user.uid);
                            })
                            .catch((err) => {
                                console.log(err);
                                alert("Erro ao Cadastrar!");
                                return;
                            });
                    }
                } else {
                    alert("Senha muito curta, por favor, insira uma senha maior!");
                }
            } else {
                alert("Insira um email válido!");
            }
        } else {
            alert("Os campos estão em branco! Por favor, insira os dados de login!");
        }
    }
  
    return (
        <div className="login-body">
            <div className="login-wrapper">
                <h1>{type === "login" ? "Login" : "Cadastro"}</h1>
                <div className="input-box">
                    <input
                        id="email"
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-box">
                    <input
                        id="senha"
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <container className="button-container">
                <Button className="login-button" onClick={handleLogin}>
                    {type === "login" ? "Acessar" : "Cadastrar"}
                </Button>
                <Button
                    className="login-button"
                    onClick={() => setType((prevType) => (prevType === "login" ? "cadastrar" : "login"))}
                >
                    {type === "login" ? "Criar uma conta" : "Já tenho uma conta"}
                </Button>
                </container>
                <a href="#" className="link">
                    {type === "login" ? "Esqueci minha senha" : <br/>}
                </a>
            </div>
        </div>
    );
}
