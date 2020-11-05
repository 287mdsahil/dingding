import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useRef} from 'react';



function MessageBox(props) {
    const text = useRef(null);

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
        onChange={e=>text.current=e.target.value}
		/>
		<Button variant="primary"
            type="submit" 
            style={{
			    margin: 'auto'
		    }}
            onClick={(e)=>{
                e.preventDefault();
                props.onSend(text.current,props.match.params.c_id);
            }}
        >
		Send
  		</Button>
	</Form>);
}
export default MessageBox;
