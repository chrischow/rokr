import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// import TestQueries from './components/TestQueries/TestQueries';
import NavBar from './components/NavBar/NavBar';
import { config } from './config';
import './App.css';

function App() {
  // Load query client
  const queryClient = new QueryClient();

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <NavBar teams={config.teams} />
        <div>
          <h1>Hello World!</h1>
        </div>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
