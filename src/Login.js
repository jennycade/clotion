import './Login.css';

import { useState } from 'react';

const Login = (props) => {
  // props
  const { createNewEmailUser, signInEmailUser, signInGoogleUser, signInAsAnon } = props;

  // state
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotPassword] = useState(false);

  // display switching
  const handleLoginClick = (event) => {
    setShowSignUp(false);
  }
  const handleSignupClick = (event) => {
    setShowSignUp(true);
  }

  // controlled input
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleForgotPassword = (event) => {
    setForgotPassword(true);
  }
  const handleUnforgotPassword = (event) => {
    setForgotPassword(false);
  }

  // form submission
  const handleSubmitEmailSignup = (event) => {
    createNewEmailUser(email, password);
  }
  const handleSubmitEmailLogin = (event) => {
    signInEmailUser(email, password);
  }


  return (
    <div className="login">
      <nav className="tabs">
        <div
          className={ `tab ${!showSignUp ? 'active' : ''}` }
          onClick={ handleLoginClick }
        >Log in</div>
        <div
          className={ `tab ${showSignUp ? 'active' : ''}` }
          onClick={ handleSignupClick }
        >Sign up</div>
      </nav>

      <button className="googleSignIn" onClick={ signInGoogleUser }>Continue with Google</button>
      <button className="anonSignIn" onClick={ signInAsAnon }>Continue anonymously</button>

      <label htmlFor="emailInput">Email</label>
      <input id="emailInput" type="text" placeholder="Enter your email address…" value={ email } onChange={ handleEmailChange } />

      {
        forgotEmail &&
        <button className="emailSignIn">
          Send reset link
        </button>
      }

      { !forgotEmail &&
      <label htmlFor="passwordInput">Password</label> }

      { !forgotEmail && 
      <input id="passwordInput" type="password" value={ password } onChange={ handlePasswordChange } />
      }
      { !forgotEmail && 
      <button
        className="emailSignIn"
        onClick={ showSignUp ? handleSubmitEmailSignup : handleSubmitEmailLogin }
      >
        Continue with email
      </button>
      }

      { !forgotEmail && !showSignUp &&
      <button className="nonButton" onClick={ handleForgotPassword }>Forgot password?</button>
      }

      { forgotEmail &&
        <button className="nonButton" onClick={ handleUnforgotPassword }>Continue with email</button>
      }

    </div>
  )
}

export default Login;