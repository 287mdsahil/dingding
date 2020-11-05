import {useCookies} from 'react-cookie';
function Message(props) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 0,
            marginTop: 10,
            width: '100%',
            marginRight: 'auto',
            justifyContent: props.fromSelf ? 'flex-end' : 'flex-start',
        }}>
            <span style={{
                padding: 10,
                margin: '0 10px',
                background: 'var(--surface)',
                borderRadius: 5,
            }}>
                {props.text}
            </span>
        </div>
    );
}

function ChatWindow(props) {
    const [cookies] = useCookies(["id"]);
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: "100%",
            flexGrow: 2,
            overflowY: 'auto',
        }}>
            {props.messages &&
                props.messages[props.match.params.c_id] &&
                props.messages[props.match.params.c_id].map((message, index) => {
                    return (
                        <Message
                            text={message.body}
                            fromSelf={message.sender === cookies.id}
                            key={index}
                        />
                    );
                })}
        </div>
    );
}
export default ChatWindow;
