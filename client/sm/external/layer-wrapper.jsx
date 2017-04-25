import React from 'react';

import Layer from 'grommet/components/Layer';

export default class LayerWrapper extends React.PureComponent {

    componentDidMount() {
        this.originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount() {
        document.body.style.overflow = this.originalOverflow;
    }

    render() {
        const { children, ...otherProps } = this.props;

        return <Layer {...otherProps}>{children}</Layer>;
    }
}
