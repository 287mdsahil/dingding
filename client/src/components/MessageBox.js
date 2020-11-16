import Button from 'react-bootstrap/Button';
import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {BsFillImageFill} from "react-icons/bs";
import {useRef} from 'react';

function SendImage(props) {
    var files = useRef(null);

    const uploadFile = () => {
        console.log(files.current[0]);
        convertToBase64(files.current[0]).then(base64 => {
            console.log(base64);
            props.onSend(base64,
                props.match.params.c_id,
                props.match.params.type,
                'img');
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            }
            reader.onerror = (err) => {
                reject(err);
            }
        });
    }

    return (<Modal
        {...props}
        centered
    >
        <Modal.Header closeButton
            style={{background: 'var(--surface)'}}
        >
            <Modal.Title>Send Image</Modal.Title>
        </Modal.Header>
        <Modal.Body
            style={{background: 'var(--surface)'}}
        >
            <input type='file'
                onChange={e => {files.current = e.target.files}}
            />
            <Button variant="primary"
                type="submit"
                style={{
                    margin: 'auto'
                }}
                onClick={(e) => {
                    e.preventDefault();
                    uploadFile();
                }}
            >
                Send
  		</Button>
        </Modal.Body>
    </Modal>);
}


function MessageBox(props) {
    const text = useRef(null);
    const [modalShow, setModalShow] = useState(false);

    return (<Form style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        width: '100%'
    }}>
        <BsFillImageFill style={{
            scale: "2",
            margin: "auto",
            marginLeft: 10,
            marginRight: 20,
        }}
            onClick={() => setModalShow(true)}
        />
        <SendImage show={modalShow} {...props} onHide={() => setModalShow(false)} />
        <Form.Control type="text"
            placeholder="Enter message"
            style={{
                margin: 'auto'
            }}
            onChange={e => text.current = e.target.value}
        />
        <Button variant="primary"
            type="submit"
            style={{
                margin: 'auto'
            }}
            onClick={(e) => {
                e.preventDefault();
                props.onSend(text.current,
                    props.match.params.c_id,
                    props.match.params.type,
                    'text');
            }}
        >
            Send
  		</Button>
    </Form>);
}
export default MessageBox;
