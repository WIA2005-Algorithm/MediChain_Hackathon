import { Container } from "@mui/material";
import Header from "./header";
import Middle from "./middle";
import NetworkPage from "./networksPage";

export default function SuperAdmin({newMode, mode, logout, user, setNotis, nav, setNav}) {
    return (
        <>
            <Header
                newMode={newMode}
                mode={mode}
                logout={logout}
                user={user}
                setNotis={setNotis}
            />
            <Container>
                <Middle nav={nav} />
                <NetworkPage
                    nav={nav}
                    setNav={setNav}
                    notis={setNotis}
                />
            </Container>
        </>
    );
}
