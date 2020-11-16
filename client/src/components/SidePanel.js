import {useState, useRef} from 'react';
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {useLocation} from 'react-router-dom'


function Sidepanel() {

    const [connections, setConnections] = useState(null);
    const [cookies] = useCookies(["id"]);
    const loc = useLocation();
    const history = useHistory();

    function ContactCard(cprops) {
        var onClickHandler = () => {
            const url = "/" + cprops.data.type + "/" + cprops.cid;
            if (url !== loc.pathname)
                history.push(url);
        }
        return (
            <div style={{
                padding: 10,
                borderBottom: 'solid',
                borderWidth: 1,
                borderColor: 'var(--surface)',
            }}
                onClick={onClickHandler}
            >
                {cprops.cid}
            </div>
        );
    }

    function AddGroupPanel() {
        const [show, setShow] = useState(false);
        const cid = useRef(null);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        return (
            <span style={{
                height: 60,
                paddingRight: 10,
            }}>
                <Button variant="primary" onClick={handleShow}>
                    +g
				</Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton
                        style={{background: 'var(--surface)'}}
                    >
                        <Modal.Title>Create new group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{background: 'var(--surface)'}}
                    >
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Connection's username"
                                aria-label="Connection's username"
                                onChange={e => {cid.current = e.target.value}}
                            />
                            <InputGroup.Append>
                                <Button variant="primary"
                                >Button</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer
                        style={{background: 'var(--surface)'}}
                    >
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </span>
        );
    }

    function AddConnectionPanel() {
        const [show, setShow] = useState(false);
        const cid = useRef(null);

        var addConnection = () => {
            const postOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "c_id": cid.current,
                    "c_data": {
                        "type": "u",
                    },
                }),
            };
            fetch("http://localhost:5000/user/" + cookies.id + "/connections/add",
                postOptions)
                .then(response => {
                    if (!response.ok) {
                        console.log("Failed with HTTP code: " + response.status);
                    } else {
                        setConnections(null);
                        fetchConnections();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        return (
            <span style={{
                height: 60,
                paddingRight: 10,
            }}>
                <Button variant="primary" onClick={handleShow}>
                    +u
            	</Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton
                        style={{background: 'var(--surface)'}}
                    >
                        <Modal.Title>Add Connection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{background: 'var(--surface)'}}
                    >
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Connection's username"
                                aria-label="Connection's username"
                                onChange={e => {cid.current = e.target.value}}
                            />
                            <InputGroup.Append>
                                <Button variant="primary"
                                    onClick={addConnection}>Button</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer
                        style={{background: 'var(--surface)'}}
                    >
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </span>
        );
    }

    var fetchConnections = () => {
        if (connections == null)
            fetch("http://localhost:5000/user/" + cookies.id + "/connections")
                .then(response => {
                    if (!response.ok) {
                        console.log("Failed with HTTP code: " + response.status);
                        return {};
                    } else {
                        return response.json();
                    }
                }).then(data => {
                    setConnections(data);
                })
                .catch(err => {
                    console.log(err);
                });
    };
    fetchConnections();


    return (
        <div style={{
            background: 'var(--background)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2,
            overflowY: 'auto',
            scrollbarColor: 'var(--surface) transparent',
        }}>
            <div style={{
                height: 60,
                padding: 10,
                borderBottom: 'solid',
                borderWidth: 1,
                borderColor: 'var(--surface)',
            }}>
                <AddConnectionPanel />
                <AddGroupPanel />
            </div>
            {connections && Object.keys(connections).map((cid, index) => {
                return <ContactCard cid={cid} key={index} data={connections[cid]} />
            })}
        </div>
    );
}

export default Sidepanel;
