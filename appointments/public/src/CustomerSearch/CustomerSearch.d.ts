import { FC } from 'react';
declare type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};
declare type Props = {
    renderCustomerActions?: (customer?: Customer) => string | JSX.Element;
};
export declare const CustomerSearch: FC<Props>;
export {};
