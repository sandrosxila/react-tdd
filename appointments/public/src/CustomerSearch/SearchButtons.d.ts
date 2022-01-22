import { FC } from 'react';
declare type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};
declare type Props = {
    customers: Customer[];
    searchTerm: string;
    limit?: number;
    lastRowIds: string[];
    pathname: string;
};
export declare const SearchButtons: FC<Props>;
export default SearchButtons;
