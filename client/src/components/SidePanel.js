import {useState, useRef, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {useLocation} from 'react-router-dom'
import Select from 'react-select'


function Sidepanel(props) {

    const [connections, setConnections] = useState(null);
    const [cookies] = useCookies(["id"]);
    const loc = useLocation();
    const history = useHistory();

    useEffect(()=>{
        props.socket.on('group-add',(group_id)=>{
            console.log(group_id);
            setConnections(null);
            fetchConnections();
        }) // eslint-disable-next-line
    },[props.socket])

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

    function AddGroupPanel(props) {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        const group_id = useRef(null);
        const users = useRef([]);

        const createGroup = () => {
            console.log(group_id.current);
            console.log(users.current.map(e => e.value));
            var g_users = users.current.map(e => e.value);
            g_users.push(cookies.id);
            const postOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "c_id": group_id.current,
                    "c_data": {
                        "type": "m",
                        "users": g_users,
                    },
                }),
            };
            fetch("http://localhost:5000/group",postOptions)
                .then(response => {
                    if (!response.ok) {
                        console.log("Failed with HTTP code: " + response.status);
                    } else {
                        console.log("Group created");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };

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
                        <FormControl
                            type="text"
                            placeholder="group name"
                            onChange={e => {group_id.current = e.target.value}}
                        />
                        {connections && <div
                            style={{color: "#212529", paddingTop:10}}
                        >
                            <Select
                                isMulti
                                onChange={e => {users.current = e}}
                                options={Object.keys(props.connections)
                                    .filter(cid => {return props.connections[cid].type === 'u'})
                                    .map(cid => {
                                        return {"label": cid, "value": cid}
                                    })}
                            />
                        </div>}
                    </Modal.Body>
                    <Modal.Footer
                        style={{background: 'var(--surface)'}}
                    >
                        <Button onClick={createGroup}>Create Group</Button>
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
                <AddGroupPanel connections={connections} />
            </div>
            {connections && Object.keys(connections).map((cid, index) => {
                return <ContactCard cid={cid} key={index} data={connections[cid]} />
            })}
        </div>
    );
}

export default Sidepanel;
