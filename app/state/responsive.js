const RESPONSIVE_CHANGE = 'RESPONSIVE_CHANGE';
const mediaQueryLists = {
    isLandscape: window.matchMedia('(orientation: landscape)'),
    isPortrait: window.matchMedia('(orientation: portrait)'),
    isPhone: window.matchMedia('(max-width: 767px)'),
    isTablet: window.matchMedia('(min-width: 768px) and (max-width: 1280px)'),
    isLaptop: window.matchMedia('(min-width: 1281px)')
}
const toAttributes = (mediaQueryLists) => {
    let attributes = {};
    for (let name in mediaQueryLists) {
        attributes[name] = mediaQueryLists[name].matches;
    }
    return attributes;
}
export function responsiveListen() {
    return (dispatch) => {
        for (let name in mediaQueryLists) {
            let mql = mediaQueryLists[name];
            mql.addListener(()=>{
                let attributes = toAttributes(mediaQueryLists);
                dispatch(responsiveChange(attributes));
            });
        }
    }
}

function responsiveChange(attributes) {
    return {
        type: RESPONSIVE_CHANGE,
        attributes
    }
}

export function responsive(state, action) {
    state = state || toAttributes(mediaQueryLists);
    switch (action.type) {
        case RESPONSIVE_CHANGE:
            return action.attributes;
        default:
            return state;
    }
}