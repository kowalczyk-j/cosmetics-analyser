import { Homepage } from "@/pages/homePage";
import { NotFoundPage } from "../pages/notFoundPage";
import { RegisterPage } from "@/pages/registerPage";
import { LoginPage } from "../pages/loginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserAccount } from "../pages/userAccountPage";
import ProtectedRoute from "./ProtectedRoute";
import { CosmeticDetailsPage } from "@/pages/cosmeticDetailsPage";

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
        <Route path="/cosmetics/:productId" element={<CosmeticDetailsPage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserAccount />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
