import React from 'react';
import { partial } from 'lodash';

import Button from 'grommet/components/Button';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';

export default function PurchaseButton({ event, onClick, label = 'Purchase' }) {
    if (!event.canPurchase) { return null; }
    return (
        <Button
            icon={<CreditCardIcon />}
            label={label}
            onClick={partial(onClick, event)}
            href='#'
        />
    );
}
