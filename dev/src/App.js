import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import TestQueries from './components/TestQueries/TestQueries';

function App() {
  // Load query client
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>Hello World!</h1>
          <TestQueries />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
