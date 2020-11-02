import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Sidepanel from './SidePanel';
import ChatWindow from './ChatWindow';
import MessageBox from './MessageBox';
import {useCookies} from 'react-cookie';
import {useEffect} from 'react';
import openSocket from 'socket.io-client';

function ChatScreen(props) {


    const [cookies] = useCookies(["id"]);
    var CheckId = () => {
        if (!cookies.id) props.history.push('/login/');
    };
    useEffect(CheckId);

    const socket = openSocket("http://localhost:5001");
    socket.emit('user-connected', cookies.id)

    return (
        <Container fluid>
            <Row style={{minHeight: "100vh"}}>
                <Col
                    xs={2}
                    md={2}
                >
                    <Sidepanel />
                </Col>
                <Col style={{
                    height: "calc(100vh - 70px)",
                    background: "var(--background-secondary)",
                    display: 'flex',
                    flexDirection: 'column',
                    scrollbarColor: 'var(--surface) transparent',
                }}>
                    <Row style={{
                        height: "100%",
                        order: 1
                    }}><ChatWindow /></Row>
                    <Row style={{
                        minHeight: "70px",
                        background: "var(--surface)",
                        order: 2
                    }}><MessageBox /></Row>
                </Col>
            </Row>
        </Container>
    );
}

export default ChatScreen;
