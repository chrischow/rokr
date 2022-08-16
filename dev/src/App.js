import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Container from "react-bootstrap/Container";
// import TestQueries from './components/TestQueries/TestQueries';
import NavBar from './components/NavBar/NavBar';
import Home from './components/HomeView/Home/Home';
import { config } from './config';
import Timeline from './components/Timeline/Timeline';
import './App.css';

function App() {
  // Load query client
  const queryClient = new QueryClient();

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <NavBar teams={config.teams} />
        <Container className="mt-5 mb-5">
          <Routes>
            <Route path="/" element={<Home teams={config.teams} />} exact />
            <Route path="/timeline" element={<Timeline />} />
          </Routes>
        </Container>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
