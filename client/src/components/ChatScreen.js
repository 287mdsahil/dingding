import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Sidepanel from './SidePanel';
import ChatWindow from './ChatWindow';
import MessageBox from './MessageBox';
import {useReducer} from 'react';
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
            console.log("ChatScreen");
            history.push('/login/');
        }
    };
    CheckId();

    function hangleMessages(messages, action) {
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
        switch (action.type) {
            case 'append':
                console.log("dispatch called");
                console.log(messages);
                if (messages[action.message.from] === undefined)
                    messages[action.message.from] = [];
                messages[action.message.from].push(action.message);
                let newMessages = {...messages};
                messages = newMessages;
                return messages;
            default: return messages;
        }
    };
    const [messages, messageDispatch] = useReducer(hangleMessages, {});
    var sendMessage = () => {
        messageDispatch({
            type: "append",
            message: {
                body: "Hello World1!",
                from: "bikram",
                sender: "bikram",
            },
        });
    };

    console.log("Messages:");
    console.log(messages);
    //const socket = openSocket("http://localhost:5001");
    // First user connection
    //props.socket.emit('user-connected', cookies.id)

    // On receiving message from server

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
