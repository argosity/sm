import React from 'react';
import Config from 'hippo/config';
import { getColumnProps } from 'react-flexbox-grid';
import classname from 'classnames';

export default function Image({ image, size = 'medium', ...props }) {
    const { className } = getColumnProps(props);
    return (
        <img className={classname('image', className)} src={image.urlFor(size)} />
    );
}
