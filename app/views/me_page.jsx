import React from 'react';
import { connect } from 'react-redux';
import { maybeGet } from '../state/objects';
import { Card, CardTitle, CardMedia } from 'material-ui';
import { Container } from 'react-layout-components';

class MePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadSocial(this.props.currentUser);
    }

    render() {
        let { socialMe: { data: { fullName } ={} } ={} } = this.props;
        return (
            <Container maxWidth={900} margin="20px auto">
                <Card>
                    <CardMedia
                        overlay={<CardTitle title={fullName} />} >
                        <img src="https://unsplash.it/900/300" />
                    </CardMedia>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.session.user,
        socialMe: state.objects[state.session.user+'/soc/me']
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);
