import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './App.css';
import Sidepanel from './components/SidePanel';

function App() {
    return (
        <div className="App">
            <Container fluid>
                <Row style={{minHeight: "100vh"}}>
                    <Col
                        xs={2}
                        md={2}
                    >
                        <Sidepanel />
                    </Col>
                    <Col style={{
                        height: "100vh",
                        background: "var(--background-secondary)",
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Row style={{
                            height: "100%",
                            order: 1
                        }}>Chats</Row>
                        <Row style={{
                            height: "70px",
                            background: "var(--surface)", 
                            order:2
                        }}>Type here</Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
