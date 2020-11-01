import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';



function MessageBox() {
	return (<Form style={{
		display: 'flex',
		flexDirection: 'row',
		padding: 10,
		width:'100%'
	}}>
		<Form.Control type="text" 
		placeholder="Enter message" 
		style={{
			margin: 'auto'
		}}
		/>
		<Button variant="primary" style={{
			margin: 'auto'
		}}>
		Send
  		</Button>
	</Form>);
}
export default MessageBox;
