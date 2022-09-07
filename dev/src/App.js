import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Container from "react-bootstrap/Container";
// import TestQueries from './components/TestQueries/TestQueries';
import NavBar from './components/NavBar/NavBar';
import Home from './components/HomeView/Home/Home';
import Team from './components/TeamView/TeamTabs/TeamTabs';
import Timeline from './components/Timeline/Timeline';
import Directory from './components/Directory/Directory';
import UpdatesMain from './components/UpdatesView/UpdatesMain/UpdatesMain';
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

  // States
  const [graph, setGraph] = useState({ network: null, exists: false });
  const graphManager = {graph, setGraph};

  // Team routes
  const teamRoutes = config.teams.map(team => {
    return <Route
      key={`route-${team.slug}`}
      path={`/${team.slug}`}
      element={<Team team={team} queryClient={queryClient} {...graphManager} />}
    />
  });

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <NavBar teams={config.teams} {...graphManager} />
        <Container className="mt-5 app-container">
          <Routes>
            <Route path="/" element={<Home teams={config.teams} />} exact />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/directory" element={<Directory key="directory" {...graphManager} />} />
            <Route path="/updates/:krId" element={<UpdatesMain />} />
            {teamRoutes}
          </Routes>
        </Container>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
