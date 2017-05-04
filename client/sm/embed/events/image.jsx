import React from 'react';
import Config from 'lanes/config';
import { getColumnProps } from 'react-flexbox-grid';
import classname from 'classnames';

export default function Image({ image, size = 'medium', ...props }) {
    if (!image.isImage) { return null; }

    const { className } = getColumnProps(props);

    return (
        <div className={classname('image', className)}>
            <img src={image.urlFor(size)} />
        </div>
    );
}
