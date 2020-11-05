import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Sidepanel from './SidePanel';
import ChatWindow from './ChatWindow';
import MessageBox from './MessageBox';
import {useState, useEffect} from 'react';
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
            }}>
                <ChatWindow
                    messages={props.messages[props.match.params.c_id]}
                />
            </Row>
            <Row style={{
                minHeight: "70px",
                background: "var(--background)",
                order: 2
            }}><MessageBox {...props} onSend={props.onSend} /></Row>
        </Col>

    );
}

function ChatScreen(props) {
    const [cookies] = useCookies(["id"]);
    const [messages, setMessage] = useState({});

    var CheckId = () => {
        let history = useHistory();
        if (!cookies.id) {
            history.push('/login/');
        }
    };
    CheckId();

    // Function that operates on messages
    const handleMessages = (action) => {
        /**
         * action: {
         *     "type" : "...",
         *     "message" : {
         *         "type: : "...", // text message or other media
         *         "body" : "...",
         *         "timestamp" : "...",
         *         "from" : "...",   // uid or gid or broadcast message
         *         "sender" : "...", // Id of user who wrote the message
         *     }
         * }
         * */
        let newMessages = {...messages};
        switch (action.type) {
            case 'self-append':
                if (newMessages[action.message.receiver] === undefined)
                    newMessages[action.message.receiver] = [];
                newMessages[action.message.receiver].push(action.message);
                setMessage(newMessages);
                break;
            case 'append':
                if (newMessages[action.message.sender] === undefined)
                    newMessages[action.message.sender] = [];
                newMessages[action.message.sender].push(action.message);
                setMessage(newMessages);
                break;
            default: //donothing
        }
        return messages;
    };

    // Function to append self messages
    var sendMessage = (text, c_id) => {
        var message = {
            contentType: "text",
            type: "u",
            body: text,
            receiver: c_id,
            sender: cookies.id,
            timestamp: null,
        };
        handleMessages({
            type: "append",
            message: message,
        });
        handleMessages({
            type: "self-append",
            message: message,
        });
        props.socket.emit("send-message", message);
    };

    // Function to handle incomming messages
    var receiveMessage = () => {
        props.socket.on("receive-message", (message) => {
            handleMessages({
                type: "append",
                message: message,
            });
        })
    }
    useEffect(receiveMessage, []);

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
