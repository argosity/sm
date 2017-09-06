import React from 'react'; // eslint-disable-line no-unused-vars
import { getColumnProps } from 'react-flexbox-grid';
import classname from 'classnames';

export default function Image({ image, size = 'medium', ...props }) {
    if (!image) { return null; }
    const { className } = getColumnProps(props);

    return (
        <img className={classname('image', className)} src={image.urlFor(size)} />
    );
}