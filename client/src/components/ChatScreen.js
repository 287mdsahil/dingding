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
                    margin: 0,
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
    const [messages, setMessages] = useState({});

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
         *         "contentType" : "..." // text or other media
         *         "type: : "...", // unicast, multicast, broadcast
         *         "body" : "...",
         *         "timestamp" : "...",
         *         "receiver" : "...",   // uid or gid or broadcast message
         *         "sender" : "...", // Id of user who wrote the message
         *     }
         * }
         * */
        var newMessages;
        switch (action.type) {
            case 'self-append': {
                if (messages[action.message.receiver] === undefined)
                    messages[action.message.receiver] = [];
                messages[action.message.receiver].push(action.message);
                newMessages = {...messages};
                setMessages(newMessages);
                break;
            }
            case 'append': {
                if (action.message.type === 'u') {
                    if (messages[action.message.sender] === undefined)
                        messages[action.message.sender] = [];
                    messages[action.message.sender].push(action.message);
                    newMessages = {...messages};
                    setMessages(newMessages);
                }
                else if (action.message.type === 'b') {
                    if (messages[action.message.receiver] === undefined)
                        messages[action.message.receiver] = [];
                    messages[action.message.receiver].push(action.message);
                    newMessages = {...messages};
                    setMessages(newMessages);
                }
                break;
            }
            default: //donothing
        }
    };

    // Function to append self messages
    var sendMessage = (text, c_id, type, contentType) => {
        var message = {
            contentType: contentType,
            type: type,
            body: text,
            receiver: c_id,
            sender: cookies.id,
            timestamp: new Date().toLocaleString(),
        };
        /*
        handleMessages({
            type: "append",
            message: message,
        });
        */
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
    // eslint-disable-next-line
    useEffect(receiveMessage, [props.socket]);

    return (
        <div style={{
            background: "var(--background-secondary)",
            display: 'flex',
            flexDirection: 'row',
            height: '100vh',
        }}>
            <div
                style={{
                    width: '150px',
                }}
            >
                <Sidepanel history={props.history} />
            </div>
            <div
                style={{
                    width: 'calc(100vw - 150px)',
                }}
            >
                {messages &&
                    <Route path="/:type/:c_id"
                        component={(props) =>
                            <ChatContainer {...props}
                                messages={messages}
                                socket={props.socket}
                                onSend={sendMessage}
                            />}
                    />}
            </div>
        </div>
    );
}

export default ChatScreen;
