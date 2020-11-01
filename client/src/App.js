import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './App.css';
import Sidepanel from './components/SidePanel';
import ChatWindow from './components/ChatWindow';
import MessageBox from './components/MessageBox';

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
                        height: "calc(100vh - 70px)",
                        background: "var(--background-secondary)",
                        display: 'flex',
                        flexDirection: 'column',
    					scrollbarColor: 'var(--background) transparent',
                    }}>
                        <Row style={{
                            height: "100%",
                            order: 1
                        }}><ChatWindow /></Row>
                        <Row style={{
                            minHeight: "70px",
                            background: "var(--surface)",
                            order: 2
                        }}><MessageBox /></Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
