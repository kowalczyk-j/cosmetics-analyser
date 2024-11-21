import "./App.css";
import Homepage from "./components/homepage";
import TestPage from "./components/TestPage";
import { RegisterPageComponent } from "./components/register-page";
import { LoginPageComponent } from "./components/login-page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserAccountComponent } from "./components/user-account";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<RegisterPageComponent />} />
        <Route path="/login" element={<LoginPageComponent />} />
        <Route path="/profile" element={<UserAccountComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
