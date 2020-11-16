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
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '60%',
            }}>
                {props.showSender && <span style={{
                    margin: '0 10px',
                    justifyContent: props.fromSelf ? 'flex-end' : 'flex-start',
                }}>
                    {props.sender}
                </span>}
                <span style={{
                    padding: 10,
                    margin: '0 10px',
                    background: 'var(--surface)',
                    borderRadius: 5,
                    wordWrap: 'break-word',
                }}>
                    {props.contentType === 'text' && props.content}
                    {props.contentType === 'img' && <img src={props.content} width="100px" />}
                </span>
                <span style={{
                    margin: '0 10px',
                    justifyContent: props.fromSelf ? 'flex-end' : 'flex-start',
                }}>
                    {props.timestamp}
                </span>
            </div>
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
                props.messages.map((message, index) => {
                    return (
                        <Message
                            content={message.body}
                            fromSelf={message.sender === cookies.id}
                            sender={message.sender}
                            showSender={message.type !== 'u' &&
                                message.sender !== cookies.id}
                            timestamp={message.timestamp}
                            contentType={message.contentType}
                            key={index}
                        />
                    );
                })}
        </div>
    );
}
export default ChatWindow;
