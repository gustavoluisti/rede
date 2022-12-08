import './Auth.css';

// Components
import Message from '../../components/Message';
import { Link } from 'react-router-dom';

// Hooks
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


//Redux
import { register, reset } from '../../slices/authSlice';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const dispatch =  useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email, 
      password,
      confirmPassword
    }
    console.log(user);

    dispatch(register(user));

    navigate("/");
  }

  // Clean all auth states 
  useEffect(()=> {
    dispatch(reset());
  },[dispatch])

  return (
    <div id="register">
      <h2>Rede</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos.</p>
      <form onSubmit={handleSubmit}>
        <input
          value={name || ""} 
          onChange={(e) => setName(e.target.value)}
          type="text" 
          placeholder="Nome" 
        />
        <input
          value={email || ""} 
          onChange={(e) => setEmail(e.target.value)}
          type="email " 
          placeholder="E-mail" 
        />
        <input
          value={password || ""} 
          onChange={(e) => setPassword(e.target.value)}
          type="password" 
          placeholder="Digite sua senha" 
        />
        <input
          value={confirmPassword || ""} 
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password" 
          placeholder="Confirme sua senha" 
        />
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui.</Link>
      </p>
    </div>
  )
}
