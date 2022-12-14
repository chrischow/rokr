import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Container from "react-bootstrap/Container";
import NavBar from './NavBar';
import ErrorBoundary from './ErrorBoundary';
import Home from './Home';
import Team from './Team';
import Updates from './Updates';
import Timeline from './Timeline';
import Timeline2 from './Timeline2';
import Directory from './Directory';
import Feedback from './Feedback';
import { config } from './config';
import { AppContextProvider } from './shared/context/AppContextProvider';
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

  //  Team routes
  const teamRoutes = config.teams.map(team => {
    return <Route
      key={`route-${team.slug}`}
      path={`/${team.slug}`}
      element={<Team team={team} />}
    />;
  });

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <NavBar teams={config.teams} />
        <Feedback />
        <Container className="mt-5 app-container">
          <ErrorBoundary>
          <AppContextProvider>
            <Routes>
              <Route path="/" element={<Home teams={config.teams} />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/timeline2" element={<Timeline2 />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/updates/:krId" element={<Updates />} />
              {teamRoutes}
            </Routes>
          </AppContextProvider>
          </ErrorBoundary>
        </Container>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
