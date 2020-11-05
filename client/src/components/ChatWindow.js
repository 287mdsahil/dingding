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
    console.log("M");
    console.log(props.messages);
    console.log(props.match.params.c_id);
    console.log(props.messages[props.match.params.c_id]);
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: "100%",
            flexGrow: 2,
            overflowY: 'auto',
        }}>
            <Message fromSelf text="dummy message" />
            <Message text="dummy message" />
            {props.messages &&
                props.messages[props.match.params.c_id] &&
                props.messages[props.match.params.c_id].map((message,index) => {
                    return (
                        <Message text={message.body} key={index}/>
                    );
                })}
        </div>
    );
}
export default ChatWindow;
