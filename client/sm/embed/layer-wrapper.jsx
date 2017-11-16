import React from 'react';

import Layer from 'grommet/components/Layer';

export default class LayerWrapper extends React.Component {

    componentDidMount() {
        this.originalOverflow = document.body.style.overflow;
        this.originalPosition = document.body.style.position;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
    }

    componentWillUnmount() {
        document.body.style.overflow = this.originalOverflow;
        document.body.style.position = this.originalPosition;
    }

    render() {
        const { children, ...otherProps } = this.props;

        return <Layer {...otherProps}>{children}</Layer>;
    }

}
