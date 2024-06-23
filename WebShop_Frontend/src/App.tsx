import './styles/styles.css';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Router from './Router';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient()

function App() {

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Router/>
      </BrowserRouter>
      <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
