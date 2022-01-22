import React from 'react';
// import { act } from 'react-dom/test-utils';
import { expectRedux } from 'expect-redux';
import { ContainerWithStore, createContainerWithStore } from './domManipulators';
import { fetchQuery } from 'relay-runtime';
import { CustomerHistory } from '../src/CustomerHistory';
jest.mock('relay-runtime');

const date = new Date('February 16, 2019');
const appointments = [
    {
        startsAt: date.setHours(9, 0, 0, 0),
        stylist: 'Jo',
        service: 'Cut',
        notes: 'Note one'
    },
    {
        startsAt: date.setHours(10, 0, 0, 0),
        stylist: 'Stevie',
        service: 'Cut & color',
        notes: 'Note two'
    }
];

const customer = {
    firstName: 'Ashley',
    lastName: 'Jones',
    phoneNumber: '123',
    appointments
};

describe('CustomerHistory', () => {
    let container: ContainerWithStore['container'], renderWithStore: ContainerWithStore['renderWithStore'], store: ContainerWithStore['store'];
    beforeEach(() => {
        ({
            container,
            renderWithStore,
            store
        } = createContainerWithStore());
        (fetchQuery as jest.Mock).mockReturnValue({ customer });
        renderWithStore(<CustomerHistory id={ '123' } />);
    });

    describe('successful', () => {

        // eslint-disable-next-line jest/expect-expect
        it('dispatches queryCustomer on mount', async () => {
            return expectRedux(store)
                .toDispatchAnAction()
                .matching({ type: 'QUERY_CUSTOMER_REQUEST', id: '123' });
        });

        it('renders the first name and last name together in a h2', () => {
            expect(container.querySelector('h2')?.textContent).toEqual(
                'Ashley Jones'
            );
        });

        it('renders a Booked appointments heading', () => {
            expect(container.querySelector('h3')).not.toBeNull();
            expect(container.querySelector('h3')?.textContent).toEqual(
                'Booked appointments'
            );
        });

        it('renders a table with four column headings', () => {
            const headings = Array.from(
                container.querySelectorAll('table > thead > tr > th')
            ).map(th => th.textContent);
            expect(headings).toEqual([
                'When',
                'Stylist',
                'Service',
                'Notes'
            ]);
        });

        const columnValues = (columnNumber: number) =>
            Array.from(container.querySelectorAll('tbody > tr')).map(
                tr => tr.childNodes[columnNumber].textContent
            );

        it('renders the start time of each appointment in the correct format', () => {
            expect(columnValues(0)).toEqual([
                'Sat Feb 16 2019 09:00',
                'Sat Feb 16 2019 10:00'
            ]);
        });
    });

    describe('submitting', () => {
        it('displays a loading message', () => {
            renderWithStore(<CustomerHistory id='' />);
            store.dispatch({ type: 'QUERY_CUSTOMER_SUBMITTING' });
            expect((container.firstChild! as HTMLDivElement).id).toEqual('loading');
            expect(container.textContent).toEqual('Loading');
        });
    });
    

    describe('failed', () => {
        it('displays an error message', () => {
            renderWithStore(<CustomerHistory id=''/>);
            store.dispatch({ type: 'QUERY_CUSTOMER_FAILED' });
            expect((container.firstChild! as HTMLDivElement).id).toEqual('error');
            expect(container.textContent).toEqual(
                'Sorry, an error occurred while pulling data from the server.'
            );
        });
    });
});