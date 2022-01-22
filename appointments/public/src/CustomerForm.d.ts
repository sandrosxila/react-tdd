import React from 'react';
declare type Props = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    onSave?: (customerWithId: {
        id: string;
    }) => void;
};
declare const CustomerForm: React.FC<Props>;
export default CustomerForm;
