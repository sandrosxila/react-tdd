import { RootAction } from './../../src/store';
import { expectRedux, storeSpy } from 'expect-redux';
import { configureStore, RootState } from '../../src/store';
import * as HistoryExports from '../../src/history';
import { StoreWithSpy } from 'expect-redux/dist/storeSpy';
import { IAppointment } from '../../src/reducers/appointment';
jest.mock('relay-runtime');

describe('customerAdded', () => {
    let store: StoreWithSpy<RootState, RootAction>, pushSpy: jest.SpyInstance;
    beforeEach(() => {
        pushSpy = jest.spyOn(HistoryExports.appHistory, 'push');
        store = configureStore([storeSpy]);
    });
    const dispatchRequest = (customer: IAppointment['customer']) =>
        store.dispatch({
            type: 'ADD_CUSTOMER_SUCCESSFUL',
            customer
        });

    it('pushes /addAppointment to history', () => {
        dispatchRequest({} as IAppointment['customer']);
        expect(pushSpy).toHaveBeenCalledWith('/addAppointment');
    });

    // eslint-disable-next-line jest/expect-expect
    it('dispatches a SET_CUSTOMER_FOR_APPOINTMENT action', () => {
        const customer = { id: '123' };
        dispatchRequest(customer);
        expectRedux(store)
            .toDispatchAnAction()
            .matching({
                type: 'SET_CUSTOMER_FOR_APPOINTMENT',
                customer
            });
    });
});