
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

ReactDOM.render(
  <GoogleOAuthProvider clientId="44555990933-vd3062g8ojsq5ed9v3qr6j17rpm39bap.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
  
  document.getElementById('root')
);
