import Nav from 'react-bootstrap/Nav'

function Sidepanel() {
    return (
        <div style={{
            background: 'var(--background)', 
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2,
            overflowY: 'auto'
        }}>
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                    Disabled
    			</Nav.Link>
            </Nav.Item>
        </div>
    );
}

export default Sidepanel;
