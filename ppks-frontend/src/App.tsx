import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import './App.css';
import RegisterUser from "./pages/RegisterUser";
import { STATE, StateContext } from "./utils/state";
import { useEffect, useState } from "react";
import axios from "axios";
import Main from "./pages/Main";
import { Spin } from "antd";
import { WebSocketProvider } from "./utils/WebSocketProvider";

function App() {
  const [global, setGlobal] = useState(STATE);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (global.user) {
      localStorage.setItem("token", global.user?.token);
    }
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      navigate("/authenticate");
      setLoading(false);
      return;
    }

    axios.get('/api/me', {
      headers: {
        Authorization: `Bearer ${savedToken}`
      }
    }).then(res => {
      if (res.data) {
        setGlobal(prev => ({ ...prev, user: { ...res.data, token: savedToken } }));
      } else {
        navigate("/authenticate");
      }
    }).catch(() => {
      navigate("/authenticate");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <StateContext.Provider value={{ global, setGlobal }}>
      <WebSocketProvider>
        <Routes>
          <Route path="/authenticate" element={<Login />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="*" element={global.user ? <Main /> : <Navigate to="/authenticate" />} />
        </Routes>
      </WebSocketProvider>
    </StateContext.Provider>
  );
}

export default App;