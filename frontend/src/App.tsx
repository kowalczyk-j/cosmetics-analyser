import "./App.css";
import Homepage from "./components/homepage";
import TestPage from "./components/TestPage";
import { RegisterPageComponent } from "./components/register-page";
import { LoginPageComponent } from "./components/login-page";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserAccountComponent } from "./components/user-account";
import ProtectedRoute from "./components/ProtectedRoute";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <RegisterPageComponent />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<TestPage />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/login" element={<LoginPageComponent />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserAccountComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
