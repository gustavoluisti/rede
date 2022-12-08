import './Auth.css';

//Components
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';

// Hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Redux
import {login, reset} from '../../slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error} = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password
    };

    dispatch(login(user));
    navigate("/");
  }

  useEffect(()=> {
    dispatch(reset());
  },[dispatch])

  return (
    <div id="login">
      <h2>Rede</h2>
      <p className='subtitle'>Faça o login para ver o que há de novo.</p>

      <form onSubmit={handleSubmit}>
        <input 
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
          type="text" 
          placeholder='E-mail' />
        <input 
          value={password || ''}
          onChange={(e) => setPassword(e.target.value)}
          type="password" 
          placeholder='Senha' />
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>Não tem uma conta? <Link to="/register">Clique aqui</Link></p>
    </div>
  )
}
