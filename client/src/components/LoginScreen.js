import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useCookies} from 'react-cookie';
import {useRef, useEffect} from 'react';

function LoginScreen(props) {
	const passwd = useRef(null);
	const userid = useRef(null);
	const [cookies, setCookie] = useCookies(["id"]);

	var CheckId = () => {
		if (cookies.id) props.history.push('/');
	};

	useEffect(CheckId);

	var login = ()=> {
		console.log('Logging in');
		setCookie('id','sahil');
	};

	var signup = () => {
		console.log('Signin in');
		const postOptions = {
			method:"POST",
			headers: {"Content-Type":"application/json"},
			body: JSON.stringify({
				"user_id": userid.current,
				"user_data": {
					"password": passwd.current,
				},
			}),
		};
		fetch("http://localhost:5000/users/add", postOptions)
		.then(response => {
			if(!response.ok) {
				console.log("Failed with HTTP code: " + response.status);
				return {};
			} else {
				return response.json;
			}
		})
		.then(data=>{
			setCookie("id",data.id);
		});
	};

	return (
		<div style={{
			background: 'var(--background)',
			height: '100vh',
			width: '100vw',
		}}>
			<Modal
				show={true}
				size="lg"
				centered
				onHide = {()=>{/*do nothing*/}}
			>
				<Modal.Header
					style={{background: 'var(--background-secondary)'}}
				>
					<Modal.Title>Login or Signup</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{background: 'var(--background-secondary)'}}
				>
					<Form>
						<Form.Group controlId="userid"
							onChange={e=>{
								userid.current = e.target.value;
							}}
						>
							<Form.Label>User Id</Form.Label>
							<Form.Control type="text" placeholder="Enter Id" />
							<Form.Text className="text-muted">
							</Form.Text>
						</Form.Group>

						<Form.Group controlId="password"
							onChange={e=>{
								passwd.current = e.target.value;
							}}
						>
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" />
						</Form.Group>
						<Button 
							variant="primary"
							onClick={login}
						>
							Login
  						</Button>
						<Button 
							variant="secondary"
							onClick={signup}
						>
							Signup
  						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default LoginScreen;
