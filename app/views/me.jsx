import React from 'react';
import { connect } from 'react-redux';

class Me extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let fullName = this.props.socialMe ? this.props.socialMe.data.fullName : '';
        return (
            <div>{fullName}</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        socialMe: state.objects[state.session.user+'/soc/me']
    };
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Me);
