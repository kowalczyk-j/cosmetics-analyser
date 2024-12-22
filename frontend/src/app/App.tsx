import { Homepage } from "@/pages/homePage";
import NotFoundPage from "../pages/notFoundPage";
import { RegisterPage } from "@/pages/registerPage";
import { LoginPageComponent } from "../pages/loginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserAccountComponent } from "../pages/userAccountPage";
import ProtectedRoute from "./ProtectedRoute";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <RegisterPage />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<NotFoundPage />} />
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
