import React from 'react';
import { connect } from 'react-redux';
import { maybeGet } from '../state/objects';
import { Card, CardHeader, CardMedia } from 'material-ui';
import { Container } from 'react-layout-components';
import { Avatar } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';

class MePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadSocial(this.props.user);
    }

    render() {
        let {
            me: { data: { fullName } ={} } ={},
            motto: { data: motto } ={}
        } = this.props;
        return (
            <Container maxWidth={900} margin="20px auto">
                <Card>
                    <CardMedia
                        overlay={<CardHeader avatar={<Avatar icon={<SocialPerson />} />} title={fullName} subtitle={motto} />} >
                        <img src="https://unsplash.it/900/200" height="200" />
                    </CardMedia>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    let user = state.session.user;
    if (!user) {
        return {};
    }
    return {
        user: user,
        me: state.objects[user+'/soc/me'],
        motto: state.objects[user+'/soc/me/motto']
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);
