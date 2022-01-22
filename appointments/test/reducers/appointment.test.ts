import { Reducer } from 'redux';
import { reducer } from '../../src/reducers/appointment';
import { itMaintainsExistingState } from '../reducerGenerators';

describe('reducer', () => {
    describe('SET_CUSTOMER_FOR_APPOINTMENT action', () => {
        const customer = { id: '123' };
        const action = {
            type: 'SET_CUSTOMER_FOR_APPOINTMENT' as const,
            customer
        };

        itMaintainsExistingState(reducer as Reducer, action);

        it('sets the customer', () => {
            expect(reducer(undefined, action)).toMatchObject({
                customer
            });
        });
    });
});
