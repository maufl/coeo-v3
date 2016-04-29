import React from 'react';

import Snackbar from 'material-ui/lib/snackbar';

let snackbar = null;

class SnackbarNotifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            open: false,
            autoHideDuration: 2000,
        };
    }

    componentDidMount() {
        snackbar = this;
    }

    render() {
        let {
            open,
            message,
            autoHideDuration
        } = this.state;
        return <Snackbar open={open}
                         autoHideDuration={autoHideDuration}
                         onRequestClose={() => this.setState({open: false})}
                         message={message} />;
    }
}

export let notify = (options) => {
    if (snackbar) {
        snackbar.setState(Object.assign({open: true}, options));
    }
}

export default SnackbarNotifications;