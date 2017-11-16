import React from 'react'; // eslint-disable-line no-unused-vars

import Button from 'grommet/components/Button';
import { CreditCard } from 'grommet-icons';

export default function PurchaseButton({ show, onClick, label = 'Purchase' }) {
    if (!show.canPurchaseOnline) { return null; }
    return (
        <Button
            icon={<CreditCard />}
            label={label}
            onClick={onClick}
            primary
        />
    );
}
