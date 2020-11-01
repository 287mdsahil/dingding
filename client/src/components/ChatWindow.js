function Message(props) {
	return (
		<div style={{
			display:'flex',
			flexDirection: 'row',
			marginBottom: 0,
			marginTop: 10,
			width: '100%',
            marginRight:'auto',
            justifyContent: props.fromSelf ? 'flex-end' : 'flex-start',
		}}>	
			<span style={{
				padding: 10,
				margin: '0 10px',
				background: 'var(--surface)',
				borderRadius: 5,
			}}>
                Test Message
            </span>
		</div>
	);
}

function ChatWindow() {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			width:'100%',
            height: "calc(100vh - 70px)",
            flexGrow: 2,
            overflowY: 'auto',
		}}>
			<Message fromSelf text="dummy message"/>
			<Message text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message fromSelf text="dummy message"/>
			<Message text="dummy message"/>
			<Message text="dummy message"/>
			<Message text="dummy message"/>
			<Message text="dummy message"/>
			<Message text="dummy message"/>
		</div>
	);
}
export default ChatWindow;
