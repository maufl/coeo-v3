import * as React from 'react';
import { Link } from 'react-router';

export default class AboutPage extends React.Component {

    render() {
        return <div>by Felix Maurer<Link to="/">login</Link></div>;
    }
}
