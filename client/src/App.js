import './App.css';
import {useHistory, Switch, Route} from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';
import openSocket from 'socket.io-client';
import {useCookies} from 'react-cookie';

function App() {
    const socket = openSocket("http://localhost:5001");
    const [cookies] = useCookies(["id"]);
    var CheckId = () => {
        let h = useHistory();
        if (!cookies.id) {
            h.push('/login/');
        } else
            socket.emit('user-connected', cookies.id)
    };
    return (
        <div className="App">
            <Switch>
            {CheckId()}
                <Route exact path="/login/" component={LoginScreen} />
                <Route path="/" component={() => <ChatScreen socket={socket} />} />
            </Switch>
        </div>
    );
}

export default App;
