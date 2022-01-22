import React, { FC, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { objectToQueryString } from '../objectToQueryString';
import { SearchButtons } from './SearchButtons';

type Customer = {
    id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

const CustomerRow: FC<{ customer: Customer, renderCustomerActions: (customer: Customer) => string | JSX.Element }> = ({ customer, renderCustomerActions }) => (
    <tr>
        <td>{ customer.firstName }</td>
        <td>{ customer.lastName }</td>
        <td>{ customer.phoneNumber }</td>
        <td>{ renderCustomerActions(customer) }</td>
    </tr>
);

type Props ={
    renderCustomerActions?: (customer: Customer) => string | JSX.Element
}

export const CustomerSearch: FC<Props> = ({
    renderCustomerActions = () => ''
}) => {

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    
    const searchTerm = searchParams.get('searchTerm') || '';
    const limit = parseInt(searchParams.get('limit')! || '10');
    const lastRowIds: string[] = 
        searchParams.get('lastRowIds')?.split(',').
            filter(id => id !== '') || Array.from([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const handleSearchTextChanged = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const params = { limit: limit.toString(), searchTerm: value };
        setSearchParams(params);
    };

    useEffect(() => {
        const fetchData = async () => {
            const after = lastRowIds.length > 0 ? lastRowIds[lastRowIds.length - 1] : '';
            
            const queryString = objectToQueryString({
                after,
                searchTerm,
                limit: limit === 10 ? '' : limit
            });

            const result = await window.fetch(
                `/customers${queryString}`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: { 'Content-type': 'application/json' } 
                });
            
            setCustomers(await result.json());
        };
        fetchData();
    }, [lastRowIds, limit, searchTerm]);

    return (
        <React.Fragment>
            <input
                value={ searchTerm }
                onChange={ handleSearchTextChanged }
                placeholder="Enter filter text"
            />
            <SearchButtons
                customers={ customers }
                searchTerm={ searchTerm }
                limit={ limit }
                lastRowIds={ lastRowIds }
                pathname={ location.pathname }
            />
            <table>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Phone number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        customers.map(customer => (
                            <CustomerRow
                                customer={ customer }
                                key={ customer.id }
                                renderCustomerActions={ renderCustomerActions }
                            />
                        ))
                    }
                </tbody>
            </table>
        </React.Fragment>
    );
};
