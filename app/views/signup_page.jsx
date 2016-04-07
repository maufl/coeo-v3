import React from 'react';
import { TextField, Avatar, RaisedButton } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';
import { signup } from '../state/session';
import { connect } from 'react-redux';
import { VBox } from 'react-layout-components';

class SignupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            password: "",
            passwordConfirmation: "",
            passwordError: ""
        };
    }

    signup() {
        if (this.state.password === this.state.passwordConfirmation) {
            this.props.signup(
                this.state.user,
                this.state.password
            )
        } else {
            this.setState({
                passwordError: "Passwords do not match."
            })
        }
    }

    render() {
        return (
            <VBox fit alignItems="center" alignSelf="center" justifyContent="center">
                <Avatar icon={<SocialPerson />} /><br />
                <TextField
                    floatingLabelText="User name"
                    value={this.state.user}
                    onChange={(e) => {this.setState({user: e.target.value})}}/>
                <br />
                <TextField
                    floatingLabelText="Password"
                    type="password"
                    value={this.state.password}
                    onChange={(e) => {this.setState({password: e.target.value})}} />
                <br />
                <TextField
                    floatingLabelText="Password confirmation"
                    errorText={this.state.passwordError}
                    type="password"
                    value={this.state.passwordConfirmation}
                    onChange={(e) => {this.setState({passwordConfirmation: e.target.value})}} />
                <br />
                <RaisedButton primary={true} label="Signup" onMouseUp={()=>{this.signup()}}/><br />
            </VBox>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        signup: (user, password) => dispatch(signup(user, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
