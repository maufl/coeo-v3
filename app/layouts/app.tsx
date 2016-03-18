import  * as React from 'react';
import { AppBar } from 'material-ui';

export default class App extends React.Component<any, any> {
    render() {
        return <div>
            <AppBar title="Coeo" />
            <div>{this.props.children}</div>
            </div>;
    }
}
