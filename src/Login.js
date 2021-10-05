import './Login.css';

import { useState } from 'react';

const Login = (props) => {
  // state
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // controlled input
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // un-submit the email (if it's already been set)
    setSubmittedEmail(false);
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const submitEmail = (event) => {
    setSubmittedEmail(true);
  }


  return (
    <div className="login">
      <h1>Log in</h1>

      <button className="googleSignIn">Continue with Google</button>
      <button className="anonSignIn">Continue anonymously</button>

      <label for="emailInput">Email</label>
      <input id="emailInput" type="text" placeholder="Enter your email address…" value={ email } onChange={ handleEmailChange } />
      
      <button className="emailSignIn">
        Continue with email
      </button>

      { submittedEmail &&
      <label for="passwordInput">Password</label> }
      { submittedEmail && 
      <input id="passwordInput" type="password" value={ password } onChange={ handlePasswordChange } />
      }
      { submittedEmail && 
      <button className="passwordSignIn">
        Continue with email
      </button>
      }

      <button className="nonButton">Forgot password?</button>


    </div>
  )
}

export default Login;