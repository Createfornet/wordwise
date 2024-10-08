import { useNavigate } from 'react-router-dom';
import PageNav from '../components/PageNav';
import { useAuth } from '../contexts/FakeAuthContext';
import styles from './Login.module.css';
import { useEffect, useState } from 'react';
import Button from '../components/Button';

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');
  const { login, isAuthenicated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (isAuthenicated) navigate('/app', { replace: true });
      console.log(1);
    },
    [isAuthenicated, navigate]
  );

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;
    login(email, password);
    console.log(isAuthenicated);
  }

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.row}>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type='primary'>Login</Button>
        </div>
      </form>
    </main>
  );
}
