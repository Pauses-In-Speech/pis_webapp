import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import Pages from './pages/Pages';
import Header from './components/Header';

function App() {
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

// https://www.youtube.com/live/x0_a9tOpExc?feature=share&t=1917
