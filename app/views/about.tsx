import * as React from 'react';
import { Link } from 'react-router';

export default class About extends React.Component<any, any> {

    render() {
        return <div>by Felix Maurer<Link to="/">login</Link></div>;
    }
}
