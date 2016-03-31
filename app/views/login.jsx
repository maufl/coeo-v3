import * as React from 'react';
import { Link } from 'react-router';
import { TextField, Avatar, RaisedButton } from 'material-ui';
import { SocialPerson }  from 'material-ui/lib/svg-icons';
import { login } from '../redux/session';
// TODO: use ES6 import
var connect = require('react-redux').connect;

var layout = require('react-layout-components');

interface LoginProperties {
    username: string,
    password: string,
    login: (username: string, password: string) => void
}

interface LoginState {
    username: string,
    password: string
}

class Login extends React.Component<LoginProperties, LoginState> {
    constructor(props: LoginProperties) {
        super(props);
        this.state = {
            username: props.username,
            password: props.password
        };
    }

    login() {
        this.props.login(
            this.refs.username.getValue(),
            this.refs.password.getValue()
        )
    }

    render() {
        return <layout.VBox fit alignItems="center" alignSelf="center" justifyContent="center">
               <Avatar icon={<SocialPerson />} /><br />
            <TextField ref="username" floatingLabelText="User name" value={this.state.username} onChange={(e) => {this.setState({username: e.target.value})}}/><br />
            <TextField ref="password" floatingLabelText="Password" type="password" value={this.state.password} onChange={(e) => { }} /><br />
            <RaisedButton primary={true} label="Login" onMouseUp={()=>{this.login()}}/><br />
            <Link to="/about">about</Link>
            </layout.VBox>;
    }
}

const mapStateToProps = (state) => {
    return { username: state.session.username };
}

const mapDispatchToProps = (dispatch) => {
    return { login: (username: string, password: string) => dispatch(login(username, password)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
