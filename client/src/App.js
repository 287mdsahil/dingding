import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';

function App() {
    return (
        <div className="App">
            <Router><Switch>
                <Route exact path="/" component={ChatScreen} />    
                <Route exact path="/login/" component={LoginScreen} />
            </Switch></Router>
        </div>
    );
}

export default App;
