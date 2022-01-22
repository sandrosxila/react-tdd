import { RootState, RootAction } from './../../src/store';
import { fetchResponseOk, fetchResponseError } from './../spyHelpers';
import { storeSpy, expectRedux } from 'expect-redux';
import { reducer } from '../../src/sagas/customer';
import { configureStore } from '../../src/store';
import { StoreWithSpy } from 'expect-redux/dist/storeSpy';
import 'whatwg-fetch';
import { itMaintainsExistingState, itSetsStatus } from '../reducerGenerators';
jest.mock('relay-runtime');

describe('addCustomer', () => {
    let store: StoreWithSpy<RootState, RootAction>;
    let spyOnFetch: jest.SpyInstance;
    // let fetchSpy: jest.SpyInstance;

    const customer = { id: '123' };
    beforeEach(() => {
        spyOnFetch = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(customer));
        // fetchSpy = jest.fn();
        store = configureStore([storeSpy]);
    });

    const dispatchRequest = (customer: object) => {
        store.dispatch({
            type: 'ADD_CUSTOMER_REQUEST',
            customer
        });
    };

    // eslint-disable-next-line jest/expect-expect
    it('sets current status to submitting', async () => {
        dispatchRequest({});

        return expectRedux(store).toDispatchAnAction().matching({
            type: 'ADD_CUSTOMER_SUBMITTING'
        });
    });
    
    it('submits request to the fetch api', async () => {
        const inputCustomer = { firstName: 'Ashley' };
        dispatchRequest(inputCustomer);

        expect(spyOnFetch).toHaveBeenCalledWith('/customers', {
            body: JSON.stringify(inputCustomer),
            method:'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });


    // eslint-disable-next-line jest/expect-expect
    it('dispatches ADD_CUSTOMER_SUCCESSFUL on success', async() => {
        dispatchRequest({});
        
        return expectRedux(store).toDispatchAnAction().matching({
            type: 'ADD_CUSTOMER_SUCCESSFUL',
            customer
        });
    });

    // eslint-disable-next-line jest/expect-expect
    it('dispatches ADD_CUSTOMER_FAILED on non-specific error', async () => {
        spyOnFetch.mockReturnValue(fetchResponseError());
        dispatchRequest({});
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({ type: 'ADD_CUSTOMER_FAILED' });
    });

    // eslint-disable-next-line jest/expect-expect
    it('dispatches ADD_CUSTOMER_VALIDATION_FAILED if validation errors were returned', async () => {
        const errors = { field: 'field', description: 'error text' };
        spyOnFetch.mockReturnValue(
            fetchResponseError(422, { errors })
        );
        dispatchRequest({});
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({
                type: 'ADD_CUSTOMER_VALIDATION_FAILED',
                validationErrors: errors
            });
    });

});

describe('reducer', () => {
    it('returns a default state for an undefined existing state', () => {
        expect(reducer(undefined, {} as any)).toEqual({
            customer: {},
            status: undefined,
            validationErrors: {},
            error: false
        });
    });

    describe('ADD_CUSTOMER_SUBMITTING actions', () => {
        const action = { type: 'ADD_CUSTOMER_SUBMITTING' as const };
        
        itSetsStatus(reducer, action, 'SUBMITTING');
        itMaintainsExistingState(reducer, action);
    });

    describe('ADD_CUSTOMER_FAILED action', () => {
        const action = {
            type: 'ADD_CUSTOMER_FAILED' as const
        };

        itSetsStatus(reducer, action, 'FAILED');
        itMaintainsExistingState(reducer, action);
    });

    describe('ADD_CUSTOMER_VALIDATION_FAILED action', () => {
        const validationErrors = { firstName: 'error text' };
        const action = {
            type: 'ADD_CUSTOMER_VALIDATION_FAILED' as const,
            validationErrors
        }; 

        itSetsStatus(reducer, action, 'VALIDATION_FAILED');
        itMaintainsExistingState(reducer, action);

        it('sets validation errors to provided errors', () => {
            expect(reducer(undefined, action)).toMatchObject({
                validationErrors
            });
        });
        
    });

    describe('ADD_CUSTOMER_SUCCESSFUL action', () => {
        const customer = { id: 123 };
        const action = {
            type: 'ADD_CUSTOMER_SUCCESSFUL' as const,
            customer
        };
        
        itSetsStatus(reducer, action, 'SUCCESSFUL');
        itMaintainsExistingState(reducer, action);
        
        it('sets customer to provided customer', () => {
            expect(reducer(undefined, action)).toMatchObject({
                customer
            });
        });
    });
});

