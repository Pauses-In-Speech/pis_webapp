import { useState } from 'react'
import { Box, Text, Flex, Link } from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { NavLink, useLocation } from 'react-router-dom';
import ToggleColorMode from './ToggleColorMode';
import { useColorMode } from '@chakra-ui/color-mode'

function MenuItem ({children, callFunct, isLast, to="/"}) {
  return (
    <Text
    mr={{base: isLast ? 0 : 4, sm: isLast ? 0 : 4}}
    display="block">
      <Link as={NavLink} to={to} _activeLink={{fontWeight:"bold"}} onClick={callFunct}>{children}</Link>
    </Text>
  )
}

function Header() {
  const [show, setShow] = useState(false)
  const toggleMenu = () => setShow(!show)
  const { colorMode, toggleColorMode } = useColorMode();
  let location = useLocation();
  console.log("LOCATION: ", location.pathname);

  const logout = () => {
    localStorage.removeItem('userLoginToken')
  };

  return (
    <Flex
      mb={8}
      py={8}
      px={8}
      as="nav"
      align="center"
      justify={'space-between'}
      wrap="wrap"
      w="100%"
      bg={colorMode === "dark" ? "gray.800" : "white"}
      // position="fixed"
      zIndex="999"
    >
      <Box w="200px">
        <Text fontSize="lg" fontWeight="bold">
          Pauses-In-Speech
        </Text>
      </Box>

      <Box display={{ base: 'block', md: 'none' }} onClick={toggleMenu}>
        {show ? <CloseIcon /> : <HamburgerIcon />}
      </Box>

      <Box
        display={{ base: show ? 'block' : 'none', md: 'block' }}
        flexBasis={{ base: "100%", md: "auto" }}>

        <Flex
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}>
          <MenuItem to="/home">Home</MenuItem>
          <MenuItem to="/library">Speech objects</MenuItem>
          {location.pathname !== "/" && <MenuItem to="/" callFunct={logout}>Logout</MenuItem>}
          {/* <MenuItem to="/account" isLast>Account</MenuItem> */}
          <ToggleColorMode />
        </Flex>
      </Box>
    </Flex>
  )
}

export default Header