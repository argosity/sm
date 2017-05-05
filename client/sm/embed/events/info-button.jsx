import React from 'react';

import Button from 'grommet/components/Button';
import CircleInformationIcon from 'grommet/components/icons/base/CircleInformation';

export default function InfoButton({ event, onClick }) {
    if (!event.page_html) { return null; }
    return (
        <Button
            icon={<CircleInformationIcon />}
            label='Information'
            onClick={onClick}
            href='#'
        />
    );
}
