import React from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Login from './components/Login';
import MemoryGrid from './components/MemoryGrid';

const Main = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <MemoryGrid />;
};

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

export default App;
