import { Image } from "antd";
import { Link } from "react-router-dom";
import LogoImage from "../assets/logoPPKS.png";
import { useContext } from "react";
import { StateContext } from "../utils/state";

interface LogoProps {
  size?: string;
}

function Logo(props: LogoProps) {
  const { global } = useContext(StateContext);

  const logoImg = (
    <Image
      src={LogoImage}
      preview={false}
      alt="Logo Image"
      style={{ height: props.size ?? "3em", borderRadius: "50%", margin: "0.2em" }}
    />
  );

  return global.user ? (
    <Link to="/">{logoImg}</Link>
  ) : (
    logoImg // bez linka kad nije loginan
  );
}

export default Logo;