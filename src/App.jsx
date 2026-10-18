import { BrowserRouter } from "react-router-dom";

import { Toaster } from "sonner";

import { AuthProvider } from "./contexts/AuthContext.jsx";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top right" 
          richColors
        />

        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App
