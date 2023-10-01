import { React, useState, useRef } from 'react'
import { Heading, Box, Stack, Button, FormControl, FormErrorMessage, Input, InputGroup, InputLeftElement, Center } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/color-mode'
import { useNavigate } from 'react-router-dom';
import { LockIcon, EmailIcon } from '@chakra-ui/icons'

function Login({ loginToken, setLoginToken }) {
  const navigate = useNavigate();

  const { colorMode, toggleColorMode } = useColorMode();

  let [authMode, setAuthMode] = useState("signin")
  const registerEmailRef = useRef();
  const registerPasswordRef = useRef();

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  let [showLoginInfo, setShowLoginInfo] = useState(false);
  const [displayText, setDisplayText] = useState('Initial Text');

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
    setShowLoginInfo(false)
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
      <Box m={4} align="center">
        <Heading p={4} size="md">Login</Heading>
        <Box border="0px" rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"} maxW="20%" p={4}>
          <Stack direction='row' align='center' justify={'space-between'} pb={4}>
            <Heading size="sm">Not registered yet?</Heading>
            <Button onClick={changeAuthMode} size='sm' variant='link'>Register</Button>
          </Stack>
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl isInvalid={showLoginInfo}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<EmailIcon />}
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    ref={loginEmailRef}
                    title='Enter a valid email address'
                  />
                </InputGroup>
              </FormControl>
              <FormControl isInvalid={showLoginInfo}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<LockIcon />}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    ref={loginPasswordRef}
                  />
                </InputGroup>
                {showLoginInfo && <FormErrorMessage>Something went wrong: {displayText}</FormErrorMessage>}
              </FormControl>
              <Box>
                <Button type="submit">
                  Submit
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Box>
    )
  }

  // Register new account
  return (
    <Box m={4} align="center">
      <Heading p={4} size="md">Register</Heading>
      <Box border="0px" rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"} maxW="20%" p={4}>
        <Stack direction='row' align='center' justify={'space-between'} pb={4}>
          <Heading size="sm">Already registered?</Heading>
          <Button onClick={changeAuthMode} size='sm' variant='link'>Login</Button>
        </Stack>
        <form onSubmit={handleRegisterAccount}>
          <Stack spacing={4}>
            <FormControl isInvalid={showLoginInfo}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<EmailIcon />}
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  ref={registerEmailRef}
                  title='Enter a valid email address'
                />
              </InputGroup>
            </FormControl>
            <FormControl isInvalid={showLoginInfo}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<LockIcon />}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  ref={registerPasswordRef}
                />
              </InputGroup>
              {showLoginInfo && <FormErrorMessage>Something went wrong: {displayText}</FormErrorMessage>}
            </FormControl>
            <Box>
              <Button type="submit">
                Submit
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>

  )
}

export default Login
