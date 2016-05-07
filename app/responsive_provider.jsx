import React from 'react';

class ResponsiveProvider extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let {
            mediaQueryLists
        } = this.props;
        for (let name in mediaQueryLists) {
            let mql = mediaQueryLists[name];
            mql.addListener(()=>this.updateMediaQueries());
        }
        this.updateMediaQueries();
    }

    updateMediaQueries() {
        let nextState = {}, { mediaQueryLists } = this.props;
        for (let name in mediaQueryLists) {
            nextState[name] = mediaQueryLists[name].matches;
        }
        this.setState(nextState);
    }

    getChildContext() {
        return this.state;
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

ResponsiveProvider.defaultProps = {
    mediaQueryLists: {
        landscape: window.matchMedia('(orientation: landscape)'),
        portrait: window.matchMedia('(orientation: portrait)'),
        phone: window.matchMedia('(max-width: 767px)'),
        table: window.matchMedia('(min-width: 768px) and (max-width: 1280px)'),
        laptop: window.matchMedia('(min-width: 1281px)')
    }
};

ResponsiveProvider.childContextTypes = {
    landscape: React.PropTypes.bool,
    portrait: React.PropTypes.bool,
    phone: React.PropTypes.bool,
    table: React.PropTypes.bool,
    laptop: React.PropTypes.bool
}

export default ResponsiveProvider;