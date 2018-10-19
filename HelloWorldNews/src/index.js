

import ReactDOM from 'react-dom';
import { HashRouter, Route, NavLink } from 'react-router-dom';
class Menu extends Component {
    render() {
        return (
            <Navbar>
                <NavLink style={{color: "white"}} activeStyle={{ color: 'cyan' }} exact to="/">
                    React example
                </NavLink>
                <NavLink style={{color: "white"}} activeStyle={{ color: 'cyan' }} to="/students">
                    Students
                </NavLink>
                <NavLink style={{color: "white"}} activeStyle={{ color: 'cyan' }} to={'/subjects'}>
                    Subjects
                </NavLink>
            </Navbar>
        );
    }
}

const root = document.getElementById("root");
if(root){
    ReactDom.render(

    root)
}