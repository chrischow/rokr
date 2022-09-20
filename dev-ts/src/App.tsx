import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Container from "react-bootstrap/Container";
import NavBar from './NavBar';
// import Home from './Home';
// import Team from './Team';
// import Timeline from './Timeline';
// import Directory from './Directory';
// import Updates from './Updates';
// import ErrorBoundary from './shared/ErrorBoundary';
import { config } from './config';
import './App.css';

function App() {
  // Load query client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: config.staleTime
      }
    }
  });
  
  return (
    <div>
    </div>
  );
}

export default App;
