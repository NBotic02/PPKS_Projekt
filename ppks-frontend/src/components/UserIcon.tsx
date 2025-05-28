import { useContext } from "react";
import { Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { StateContext } from "../utils/state";
import { useNavigate } from "react-router";
import { useToggleable } from "../hooks/useToggleable.ts";
import Avatar from "antd/es/avatar/Avatar";
import FloatingList from "./FloatingList.tsx";

function UserIcon() {
  const { global, setGlobal } = useContext(StateContext);
  const [active, toggle] = useToggleable(false);
  const navigate = useNavigate();

  function onLogout() {
    setGlobal({ ...global, user: undefined });
    localStorage.removeItem("token");
    navigate("/authenticate");
  }

  const items = [
    {
      text: "Odjava",
      icon: <LogoutOutlined />,
      onClick: onLogout,
    }
  ];

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <Typography.Title level={5} style={{ margin: "0 1em", color: "white" }}>{global.user?.username}</Typography.Title>
      <Avatar onClick={toggle} icon={<UserOutlined />} style={{ cursor: "pointer" }}/>
      {active && <FloatingList data={items} />}
    </div>
  );
}

export default UserIcon;