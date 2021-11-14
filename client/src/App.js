import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import InsertClient from "./components/insertClient";
import VirtualClock from './components/VirtualClock';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import ProductCards from './components/ProductCards';

function App() {

    return (
        <Container className="App bg-light text-dark p-0 m-0 min-vh-100" fluid>
            <Router>
                <AppNavbar />
                <VirtualClock />
                <Switch>
                    <Route exact path='/insert-client'>
                        <InsertClient />
                    </Route>
                    <Route exact path='/browse-products'>
                        <ProductCards/>
                    </Route>
                </Switch>
            </Router>
        </Container>
    );
}

export default App;
