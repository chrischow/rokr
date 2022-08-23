import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Container from "react-bootstrap/Container";
// import TestQueries from './components/TestQueries/TestQueries';
import NavBar from './components/NavBar/NavBar';
import Home from './components/HomeView/Home/Home';
import Team from './components/TeamView/Team/Team';
import Timeline from './components/Timeline/Timeline';
import { config } from './config';
import './App.css';

function App() {
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
            <Route path="/" element={<Home teams={config.teams} />} exact />
            <Route path="/timeline" element={<Timeline />} />
            {teamRoutes}
          </Routes>
        </Container>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
