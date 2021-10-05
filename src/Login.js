import './Login.css';

const Login = (props) => {
  return (
    <div className="login">
      <h1>Log in</h1>

      <button className="googleSignIn">Continue with Google</button>
      <button className="anonSignIn">Continue anonymously</button>

      <label for="emailInput">Email</label>
      <input id="emailInput" type="text" placeholder="Enter your email address…" />
      
      <button className="emailSignIn">
        Continue with email
      </button>

      <button className="nonButton">Forgot password?</button>


    </div>
  )
}

export default Login;