import { ChakraProvider } from '@chakra-ui/react'
// import { BrowserRouter } from "react-router-dom";
import Pages from './pages/Pages';
import Header from './components/Header';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Header />
        <Pages />
      </div>
    </ChakraProvider>
  );
}

export default App;
