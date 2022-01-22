import React from 'react';
import 'whatwg-fetch';
import { Container, createContainer } from '../domManipulators';
import { CustomerSearch } from '../../src/CustomerSearch/CustomerSearch';
import { fetchResponseOk } from '../spyHelpers';
import { MemoryRouter } from 'react-router-dom';
import * as SearchButtonsExports from '../../src/CustomerSearch/SearchButtons';
jest.mock('relay-runtime');

describe('CustomerSearch', () => {
    let renderAndWait: Container['renderAndWait'];
    let element: Container['element'];
    let elements: Container['elements'];

    let spyOnFetch: jest.SpyInstance;
    let spyOnSearchButtons: jest.SpyInstance;

    beforeEach(() => {
        ({
            renderAndWait,
            element,
            elements,
        } = createContainer());

        spyOnFetch = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk([]));
        spyOnSearchButtons = jest.spyOn(SearchButtonsExports, 'SearchButtons');
    });

    afterEach(() => {
        spyOnFetch.mockReset();
    });

    const oneCustomer = [
        { id: '1', firstName: 'A', lastName: 'B', phoneNumber: '1' },
    ];

    const twoCustomers = [
        { id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1' },
        { id: 2, firstName: 'C', lastName: 'D', phoneNumber: '2' }];

    const tenCustomers = Array.from('0123456789', id => ({ id }));

    // const anotherTenCustomers = Array.from('ABCDEFGHIJ', id => ({ id }));

    // const lessThanTenCustomers = Array.from('0123456', id => ({
    //     id: id
    // }));
    
    // const twentyCustomers = Array.from('0123456789ABCDEFGHIJ', id => ({
    //     id: id
    // }));

    it('renders a table with four headings', async () => {
        await renderAndWait(
            <MemoryRouter>
                <CustomerSearch />
            </MemoryRouter>
        );
        const headings = elements<HTMLTableCellElement>('table th');
        expect(headings.map(h => h.textContent)).toEqual([
            'First name', 'Last name', 'Phone number', 'Actions'
        ]);
    });

    it('fetches all customer data when component mounts', async () => {
        await renderAndWait(
            <MemoryRouter>
                <CustomerSearch />
            </MemoryRouter>
        );
        expect(spyOnFetch).toHaveBeenCalledWith('/customers', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-type': 'application/json'
            }
        });
    });
        
    it('renders all customer data in a table row', async () => {
        spyOnFetch.mockReturnValue(fetchResponseOk(oneCustomer));
        await renderAndWait(
            <MemoryRouter>
                <CustomerSearch />
            </MemoryRouter>
        );
        const cells = elements<HTMLTableCellElement>('table tbody td');
        expect(cells[0].textContent).toEqual('A');
        expect(cells[1].textContent).toEqual('B');
        expect(cells[2].textContent).toEqual('1');
    });
    
    it('renders multiple customer rows', async () => {
        spyOnFetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(
            <MemoryRouter>
                <CustomerSearch />
            </MemoryRouter>
        );
        const rows = elements<HTMLTableRowElement>('table tbody tr');
        expect(rows[1].childNodes[0].textContent).toEqual('C');
    });

    it('has a search input field with a placeholder', async () => {
        await renderAndWait(
            <MemoryRouter>
                <CustomerSearch />
            </MemoryRouter>
        );
        expect(element('input')).not.toBeNull();
        expect(element('input')?.getAttribute('placeholder')).toEqual('Enter filter text');
    });


    it('displays provided action buttons for each customer', async () => {
        const actionSpy = jest.fn<string, []>();
        actionSpy.mockReturnValue('actions');
        spyOnFetch.mockReturnValue(fetchResponseOk(oneCustomer));
        await renderAndWait(
            <MemoryRouter>
                <CustomerSearch renderCustomerActions={ actionSpy }/>
            </MemoryRouter>
        );
        const rows = elements<HTMLTableCellElement>('table tbody td');
        expect(rows[rows.length - 1].textContent).toEqual('actions');
    });

    it('passes customer to the renderCustomActions prop', async () => {
        const actionSpy = jest.fn<string, [(typeof oneCustomer)[number] | undefined]>();
        actionSpy.mockReturnValue('actions');
        spyOnFetch.mockReturnValue(fetchResponseOk(oneCustomer));
        await renderAndWait(
            <MemoryRouter>
                <CustomerSearch renderCustomerActions={ actionSpy }/>
            </MemoryRouter>
        );
        expect(actionSpy).toHaveBeenLastCalledWith(oneCustomer[0]);
    });

    it('renders SearchButtons with props', async () => {
        spyOnFetch.mockReturnValue(fetchResponseOk(tenCustomers));

        await renderAndWait(
            <MemoryRouter initialEntries={
                ['/path?&searchTerm=term&limit=20&lastRowIds=123']
            }>
                <CustomerSearch />
            </MemoryRouter>
        );
    
        expect(
            spyOnSearchButtons
        ).toHaveBeenCalledWith(
            {
                customers: tenCustomers,
                searchTerm: 'term',
                limit: 20,
                lastRowIds: ['123'],
                pathname: '/path'
            },
            expect.anything()
        );
    });
});
