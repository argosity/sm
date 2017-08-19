import React from 'react'; // eslint-disable-line no-unused-vars

import Button from 'grommet/components/Button';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';

export default function PurchaseButton({ event, onClick, label = 'Purchase' }) {
    if (!event.canPurchase) { return null; }
    return (
        <Button
            icon={<CreditCardIcon />}
            label={label}
            onClick={onClick}
        />
    );
}
