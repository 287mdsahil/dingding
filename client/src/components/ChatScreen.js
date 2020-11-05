import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Sidepanel from './SidePanel';
import ChatWindow from './ChatWindow';
import MessageBox from './MessageBox';
import {useState, useRef} from 'react';
import {useCookies} from 'react-cookie';
import {Route, useHistory} from 'react-router-dom';

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
            }}><ChatWindow {...props} /></Row>
            <Row style={{
                minHeight: "70px",
                background: "var(--background)",
                order: 2
            }}><MessageBox onSend={props.onSend} /></Row>
        </Col>

    );
}

function ChatScreen(props) {
    const [cookies] = useCookies(["id"]);
    let history = useHistory();
    var CheckId = () => {
        if (!cookies.id) {
            history.push('/login/');
        }
    };
    CheckId();

    const count = useRef(0);

    function hangleMessages(action) {
        /**
         * action: {
         *     "type" : "...",
         *     "message" : {
         *         "body" : "...",
         *         "timestamp" : "...",
         *         "from" : "...",   // uid or gid or broadcast message
         *         "sender" : "...", // Id of user who wrote the message
         *     }
         * }
         * */
        count.current = count.current + 1;
        switch (action.type) {
            case 'append':
                let newMessages = {...messages};
                if (messages[action.message.c_id] === undefined)
                    newMessages[action.message.c_id] = [];
                newMessages[action.message.c_id].push(action.message);
                setMessage(newMessages);
                return messages;
            default: return messages;
        }
    };
    const [messages, setMessage] = useState({});
    var sendMessage = (text) => {
        hangleMessages({
            type: "append",
            message: {
                body: text,
                c_id: "bikram",
                sender: cookies.id,
            },
        });
    };

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
                {messages &&
                    <Route path="/:type/:c_id"
                        component={(props) =>
                            <ChatContainer {...props}
                                messages={messages}
                                socket={props.socket}
                                onSend={sendMessage}
                            />}
                    />}
            </Row>
        </Container>
    );
}

export default ChatScreen;
