import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/color-mode';
import { BrowserRouter } from "react-router-dom";
import Pages from './pages/Pages';
import Header from './components/Header';
import { useEffect } from 'react';
import theme from "./theme"

function App() {
  useEffect(() => {
    document.title = "PIS App"
    // document.body.style = "background: #222222;"
    // document.body.style = "background: #333333;"
    // TODO: Set a tab icon to a href like "favicon.ico"
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Pages />
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

// https://www.youtube.com/live/x0_a9tOpExc?feature=share&t=5196
