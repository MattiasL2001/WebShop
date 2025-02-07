import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Router from './views/Router';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

const queryClient = new QueryClient()

function App() {

  return (
    <AuthProvider>
      <div className="App">
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Router/>
        </BrowserRouter>
        <ReactQueryDevtools />
        </QueryClientProvider>
      </div>
    </AuthProvider>
  );
}

export default App;
