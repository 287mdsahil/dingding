function Message() {
	return (
		<div style={{
			display:'flex',
			flexDirection: 'row',
			marginBottom: 0,
			marginTop: 10,
			width: '100%',
		}}>	
			<span style={{
				padding: 10,
				margin: '0 10px',
				background: 'var(--surface)',
				borderRadius: 5
			}}>Test Message</span>
		</div>
	);
}

function ChatWindow() {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			width:'100%',
			height: '100%',
            flexGrow: 2,
            overflowY: 'auto',
		}}>
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
		</div>
	);
}
export default ChatWindow;
