import './Login.css';

import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';

const Login = (props) => {
  // state
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotPassword] = useState(false);

  // clear out password if submittedEmail changes
  useEffect(() => {
    setPassword('')
  }, [submittedEmail, setPassword]);

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

  const handleForgotPassword = (event) => {
    setForgotPassword(true);
  }
  const handleUnforgotPassword = (event) => {
    setForgotPassword(false);
  }


  return (
    <div className="login">
      <h1>Log in</h1>

      <button className="googleSignIn">Continue with Google</button>
      <button className="anonSignIn">Continue anonymously</button>

      <label htmlFor="emailInput">Email</label>
      <input id="emailInput" type="text" placeholder="Enter your email address…" value={ email } onChange={ handleEmailChange } />
      
      { !submittedEmail && !forgotEmail &&
      <button className="emailSignIn" onClick={ submitEmail }>
        Continue with email
      </button>
      }

      {
        forgotEmail &&
        <button className="emailSignIn">
          Send reset link
        </button>
      }

      { submittedEmail &&
      <label htmlFor="passwordInput">Password</label> }
      { submittedEmail && 
      <input id="passwordInput" type="password" value={ password } onChange={ handlePasswordChange } />
      }
      { submittedEmail && 
      <button className="emailSignIn">
        Continue with email
      </button>
      }

      { !forgotEmail &&
      <button className="nonButton" onClick={ handleForgotPassword }>Forgot password?</button>
      }

      { forgotEmail &&
        <button className="nonButton" onClick={ handleUnforgotPassword }>Continue with email</button>
      }



    </div>
  )
}

export default Login;