import {useState, useRef} from 'react';
import {useCookies} from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {useLocation} from 'react-router-dom'


function Sidepanel(props) {

    const [connections, setConnections] = useState(null);
    const [cookies] = useCookies(["id"]);
    const loc = useLocation();

    function ContactCard(cprops) {
        var onClickHandler = () => {
            const url = "/" + cprops.data.type + "/" + cprops.cid;
            console.log(url);
            if (url !== loc.pathname)
                props.history.push(url);
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
            <div style={{
                padding: 10,
                borderBottom: 'solid',
                borderWidth: 1,
                borderColor: 'var(--surface)',
                height: 60,
            }}>
                <Button variant="primary" onClick={handleShow}>
                    Add Connection
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
            </div>
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
                    console.log(data);
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
            <AddConnectionPanel />
            {connections && Object.keys(connections).map((cid, index) => {
                return <ContactCard cid={cid} key={index} data={connections[cid]} />
            })}
        </div>
    );
}

export default Sidepanel;
