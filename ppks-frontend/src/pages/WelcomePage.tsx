import { Layout, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { useContext } from "react";
import Logo from "../components/Logo";
import { StateContext } from "../utils/state";

function WelcomeView() {
    const { global } = useContext(StateContext);

    const background = "linear-gradient(30deg, rgb(115, 140, 199) 0%, rgb(215, 222, 232) 35%, rgb(248, 248, 249) 100%)";

    return (
        <Layout style={{ padding: "5em 4em", display: "flex", flexDirection: "row", background, height: "100vh" }}>
            <Content style={{ display: "flex", flexDirection: "column", minHeight: 280, alignItems: "center" }}>
                <Logo size="8em" />
                <Typography.Title level={1}>Web aplikacija za grupno upravljanje zadacima</Typography.Title>
                {global.user?.role !== "ADMIN" &&
                    (
                        <>
                            <Typography.Paragraph style={{ fontSize: "1.5em" }}>
                                Platforma za pametnu organizaciju, bolju suradnju i povećanu produktivnost tima – sve na jednom mjestu.
                            </Typography.Paragraph>
                        </>
                    )
                }
            </Content>
        </Layout>
    );
}

export default WelcomeView;