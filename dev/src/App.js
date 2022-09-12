import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Container from "react-bootstrap/Container";
import NavBar from './shared/NavBar';
import Home from './Home';
import Team from './Team';
import Timeline from './Timeline';
import Directory from './Directory';
import Updates from './Updates';
import { config } from './config';
import './App.css';

function App() {
  // State for displaying splash
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    setTimeout(() => setLoading(false), 6000);
  }, []);

  // Load query client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: config.staleTime,
      },
    },
  });

  // Team routes
  const teamRoutes = config.teams.map(team => {
    return <Route
      key={`route-${team.slug}`}
      path={`/${team.slug}`}
      element={<Team team={team} queryClient={queryClient} />}
    />
  });

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <NavBar teams={config.teams} />
        <Container className="mt-5 app-container">
          <Routes>
            <Route path="/" element={<Home teams={config.teams} loading={loading} />} exact />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/directory" element={<Directory key="directory" />} />
            <Route path="/updates/:krId" element={<Updates />} />
            {teamRoutes}
          </Routes>
        </Container>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
