import React from 'react'; // eslint-disable-line no-unused-vars

export default function NoShowsFound({ shows }) {
    if (shows.length) { return null; }
    return (
        <h2>No shows are currently listed.</h2>
    );
}
