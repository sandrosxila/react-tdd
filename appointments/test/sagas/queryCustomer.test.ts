import { RootAction } from './../../src/store';
import { QueryCustomerSuccessful, reducer, query } from '../../src/sagas/queryCustomer';
import { itMaintainsExistingState, itSetsStatus } from '../reducerGenerators';
import { expectRedux, storeSpy } from 'expect-redux';
import { configureStore, RootState } from '../../src/store';
import { fetchQuery } from 'relay-runtime';
import { getEnvironment } from '../../src/relayEnvironment';
import { StoreWithSpy } from 'expect-redux/dist/storeSpy';
jest.mock('relay-runtime');

describe('reducer', () => {
    it('returns a default state for an undefined existing state', () => {
        expect(reducer(undefined, {} as any)).toEqual({
            customer: {
                id:'',
                firstName:'',
                lastName:'',
                phoneNumber:''
            },
            appointments: [],
            status: undefined
        });
    });
});

describe('QUERY_CUSTOMER_SUBMITTING action', () => {
    const action = { type: 'QUERY_CUSTOMER_SUBMITTING' };
    itSetsStatus(reducer, action, 'SUBMITTING');
    itMaintainsExistingState(reducer, action);
});

describe('QUERY_CUSTOMER_FAILED action', () => {
    const action = { type: 'QUERY_CUSTOMER_FAILED' };
    itSetsStatus(reducer, action, 'FAILED');
    itMaintainsExistingState(reducer, action);
});

describe('QUERY_CUSTOMER_SUCCESSFUL action', () => {
    const customer = { id: '123', firstName: '', lastName:'', phoneNumber: '' };
    const appointments = [{ starts: 123 }];
    const action = {
        type: 'QUERY_CUSTOMER_SUCCESSFUL',
        customer,
        appointments: appointments as any
    } as QueryCustomerSuccessful;
    itSetsStatus(reducer, action, 'SUCCESSFUL');
    itMaintainsExistingState(reducer, action);
    it('sets received customer and appointments', () => {
        expect(reducer(undefined, action)).toMatchObject({
            customer,
            appointments
        });
    });
});

describe('queryCustomer', () => {
    const appointments = [{ startsAt: 123 }];
    const customer = { id: '123', appointments };
    
    let store: StoreWithSpy<RootState, RootAction>;
    beforeEach(() => {
        store = configureStore([storeSpy]);
        (fetchQuery as jest.Mock).mockReturnValue({ customer });
    });

    const dispatchRequest = () =>
        store.dispatch({ type: 'QUERY_CUSTOMER_REQUEST', id: '123' });

    it('calls fetchQuery', async () => {
        dispatchRequest();
        expect(fetchQuery).toHaveBeenCalledWith(
            getEnvironment(),
            query,
            { id: '123' }
        );
    });

    // eslint-disable-next-line jest/expect-expect
    it('sets status to submitting', async () => {
        dispatchRequest();
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({ type: 'QUERY_CUSTOMER_SUBMITTING' });
    });

    // eslint-disable-next-line jest/expect-expect
    it('dispatches a SUCCESSFUL action when the call succeeds', async () => {
        const appointmentsWithConvertedTimestamps = [
            { startsAt: 123 }
        ];
        dispatchRequest();
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({
                type: 'QUERY_CUSTOMER_SUCCESSFUL',
                customer,
                appointments: appointmentsWithConvertedTimestamps
            });
    });

    // eslint-disable-next-line jest/expect-expect
    it('dispatches a FAILED action when the call throws an error', async () => {
        (fetchQuery as jest.Mock).mockReturnValue(Promise.reject(new Error()));
        dispatchRequest();
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({ type: 'QUERY_CUSTOMER_FAILED' });
    });

});
