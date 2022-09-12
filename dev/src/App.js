import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools'
import Container from "react-bootstrap/Container";
import NavBar from './shared/NavBar';
import Home from './Home';
import Team from './Team';
import Timeline from './Timeline';
import Directory from './Directory';
import Updates from './Updates';
import { config } from './config';
import './App.css';
import ErrorBoundary from './shared/ErrorBoundary';

function App() {
  // Load query client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: config.staleTime,
        refetchInterval: config.staleTime,
        refetchIntervalInBackground: true
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
        <ErrorBoundary>
          <Container className="mt-5 app-container">
            <Routes>
              <Route path="/" element={<Home teams={config.teams} />} exact />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/directory" element={<Directory key="directory" />} />
              <Route path="/updates/:krId" element={<Updates />} />
              {teamRoutes}
            </Routes>
          </Container>
        </ErrorBoundary>
        {/* <ReactQueryDevtools initialIsOpen={false}/> */}
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
