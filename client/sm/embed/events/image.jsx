import React from 'react';
import Config from 'hippo/config';
import { getColumnProps } from 'react-flexbox-grid';
import classname from 'classnames';

export default function Image({ image, size = 'medium', ...props }) {
    const { className } = getColumnProps(props);
    return (
        <div className={classname('image', className)}>
            <img src={image.urlFor(size)} />
        </div>
    );
}
