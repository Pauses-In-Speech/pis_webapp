import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import Pages from './pages/Pages';
import Header from './components/Header';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = "PIS App"
    // document.body.style = "background: #222222;"
    // document.body.style = "background: #333333;"
    // TODO: Set a tab icon to a href like "favicon.ico"
  }, []);
  return (
    <ChakraProvider>
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
