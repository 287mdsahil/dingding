import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Sidepanel from './SidePanel';
import ChatWindow from './ChatWindow';
import MessageBox from './MessageBox';
import {useCookies} from 'react-cookie';
import openSocket from 'socket.io-client';
import {Route} from 'react-router-dom';

function ChatContainer(props) {
    return (
        <Col style={{
            height: "100vh",
            display: 'flex',
            flexDirection: 'column',
            scrollbarColor: 'var(--surface) transparent',
        }}>
            <Row>
                <div style={{
                    width: '100%',
                    background: "var(--background)",
                    padding: 10,
                    fontSize: 20,
                    height: 60,
                }}>
                    {props.match.params.type}/{props.match.params.c_id}
                </div>
            </Row>
            <Row style={{
                height: "calc(100vh - 60px  - 70px)",
                order: 1
            }}><ChatWindow /></Row>
            <Row style={{
                minHeight: "70px",
                background: "var(--background)",
                order: 2
            }}><MessageBox /></Row>
        </Col>

    );
}

function ChatScreen(props) {
    const [cookies] = useCookies(["id"]);

    var CheckId = () => {
        if (!cookies.id) props.history.push('/login/');
    };
    CheckId();


    const socket = openSocket("http://localhost:5001");
    socket.emit('user-connected', cookies.id)

    return (
        <Container fluid style={{
            background: "var(--background-secondary)",
        }}>
            <Row style={{height: "100vh"}}>
                <Col
                    xs={2}
                    md={2}
                >
                    <Sidepanel history={props.history} />
                </Col>
                <Route path="/:type/:c_id"
                    component={(props) => <ChatContainer {...props} socket={socket} />}
                />
            </Row>
        </Container>
    );
}

export default ChatScreen;
