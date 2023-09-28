import { useState } from 'react'
import { Box, Text, Flex, Link } from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { NavLink } from 'react-router-dom';
import ToggleColorMode from './ToggleColorMode';
import { useColorMode } from '@chakra-ui/color-mode'

function MenuItem ({children, isLast, to="/"}) {
  return (
    <Text
    mr={{base: isLast ? 0 : 4, sm: isLast ? 0 : 4}}
    display="block">
      <Link as={NavLink} to={to} _activeLink={{fontWeight:"bold"}}>{children}</Link>
    </Text>
  )
}

function Header() {
  const [show, setShow] = useState(false)
  const toggleMenu = () => setShow(!show)
  const { colorMode, toggleColorMode } = useColorMode();

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
          <MenuItem to="/">Login</MenuItem>
          <MenuItem to="/home">Home</MenuItem>
          <MenuItem to="/library">Speech objects</MenuItem>
          {/* <MenuItem to="/account" isLast>Account</MenuItem> */}
          <MenuItem to="/account">Account</MenuItem>
          <ToggleColorMode />
        </Flex>
      </Box>
    </Flex>
  )
}

export default Header