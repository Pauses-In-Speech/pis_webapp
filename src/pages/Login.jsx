import { React, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

function Login({loginToken, setLoginToken}) {
  const navigate = useNavigate();
  let [authMode, setAuthMode] = useState("signin")
  const registerEmailRef = useRef();
  const registerPasswordRef = useRef();

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  let [showLoginInfo, setShowLoginInfo] = useState(false);
  const [displayText, setDisplayText] = useState('Initial Text');
  
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  const handleRegisterAccount = async (e) => {
    e.preventDefault();
    // console.log(registerEmailRef.current.value)
    // console.log(registerPasswordRef.current.value)
    var registerData = {
      "email": registerEmailRef.current.value,
      "password": registerPasswordRef.current.value,
    }
    registerData = JSON.stringify(registerData)
    console.log(registerData)

    try {
      const response = await fetch('http://0.0.0.0:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: registerData,
      });
      const data = await response.json();
      if (response.status === 400) {
        console.log("Caught 400 status: User already exists (pis).")
        setShowLoginInfo(true);

        // update logInInfoMessage to reflect the error
        setDisplayText("User already exists");

      } else if (response.ok) {
        console.log("Response for registration was OK");
        setShowLoginInfo(false);
        changeAuthMode();
      }
      console.log(data)
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    var loginData = {
      "username": loginEmailRef.current.value,
      "password": loginPasswordRef.current.value,
    }
    console.log(loginData)

    try {
      const response = await fetch('http://0.0.0.0:8000/auth/jwt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(loginData),
      });
      const data = await response.json();
      if (response.status === 400) {
        console.log("Caught 400 status: Wrong username or password (pis).") //TODO: Check error codes and rewrite
        setShowLoginInfo(true);
        setDisplayText("Wrong username or password");

      } else if (response.ok) {
        console.log("Login was successfull. Token: ", data.access_token);
        // console.log(data);
        setShowLoginInfo(false);
        setLoginToken(data.access_token);
        navigate("/home");

      }
      console.log(data)
    } catch (error) {
      console.log("Error:", error);
    }
  }


  if (authMode === "signin") {
    // Log in to account
    return (
      <div className="Auth-form-container">
        <form onSubmit={handleLogin} className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Login</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Register
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                ref={loginEmailRef}
                title='Enter a valid email address'
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                ref={loginPasswordRef}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>

        <div>
          {showLoginInfo && <span><p style={{ color: 'red' }}>Something went wrong: {displayText}</p></span>}
        </div>
      </div>
    )
  }

  // Register new account
  return (
    <div className="Auth-form-container">
      <form onSubmit={handleRegisterAccount} className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Register</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Login
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              ref={registerEmailRef}
              title='Enter a valid email address'
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              ref={registerPasswordRef}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>

      <div>
          {showLoginInfo && <span><p style={{ color: 'red' }}>Something went wrong: {displayText}</p></span>}
      </div>

    </div>

  )
}

export default Login
