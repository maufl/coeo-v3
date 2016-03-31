import React from 'react';
import { Link } from 'react-router';
import { TextField, Avatar, RaisedButton } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';
import { login } from '../redux/session';
import { connect } from 'react-redux';
import { VBox } from 'react-layout-components';

class Login extends React.Component {
    constructor(props: LoginProperties) {
        super(props);
        this.state = {
            username: props.username,
            password: props.password
        };
    }

    login() {
        this.props.login(
            this.state.username,
            this.state.password
        )
    }

    render() {
        return (
            <VBox fit alignItems="center" alignSelf="center" justifyContent="center">
                <Avatar icon={<SocialPerson />} /><br />
                <TextField
                    floatingLabelText="User name"
                    value={this.state.username}
                    onChange={(e) => {this.setState({username: e.target.value})}}/>
                <br />
                <TextField
                    floatingLabelText="Password"
                    type="password"
                    value={this.state.password}
                    onChange={(e) => {this.setState({password: e.target.value})}} />
                <br />
                <RaisedButton primary={true} label="Login" onMouseUp={()=>{this.login()}}/><br />
                <Link to="/about">about</Link>
            </VBox>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.session.username
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (username, password) => dispatch(login(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
