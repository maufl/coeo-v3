import * as React from 'react';
import { Link } from 'react-router';
import { TextField, Avatar, RaisedButton } from 'material-ui';
import { SocialPerson }  from 'material-ui/lib/svg-icons';

var layout = require('react-layout-components');

export default class Login extends React.Component<any, any> {
    render() {
        return <layout.VBox fit alignItems="center" alignSelf="center" justifyContent="center">
               <Avatar icon={<SocialPerson />} /><br />
            <TextField floatingLabelText="User name" /><br />
            <TextField floatingLabelText="Password" type="password" /><br />
            <RaisedButton primary={true} label="Login" /><br />
            <Link to="/about">about</Link>
            </layout.VBox>;
    }
}
