import React from 'react'; // eslint-disable-line no-unused-vars
import cn from 'classnames';

export default function PointerArrow(props) {
    const { className, ...unknownProps } = props;
    return (
        <svg
            className={cn('pointer-arrow', className)}
            width="100%"
            height="100%"
            viewBox="0 0 209 131"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
            style={{
                fillRule: 'evenodd',
                clipRule: 'evenodd',
                strokeLinejoin: 'round',
                strokeMiterlimit: '1.41421',
            }}
            {...unknownProps}
        >
            <g transform="matrix(1.22465e-16,-2,2,1.22465e-16,-64.6704,226.131)">
                <path d="M80.253,41.783L47.574,41.783L47.574,136.594L66.574,136.594L66.574,60.783L80.253,60.783L80.253,70.229L113.065,51.281L80.253,32.335L80.253,41.783Z" style={{fill: 'rgb(237,111,0)', fillRule: 'nonzero'}} />
            </g>
        </svg>
    );
}
