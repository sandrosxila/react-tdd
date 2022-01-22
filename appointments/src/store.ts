import { QueryCustomerAction, IQueryCustomer, reducer as queryCustomerReducer, queryCustomer } from './sagas/queryCustomer';
import { StoreWithSpy } from 'expect-redux/dist/storeSpy';
import { createStore, applyMiddleware, compose, combineReducers, StoreEnhancer } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, takeLatest } from 'redux-saga/effects';
import { addCustomer, CustomerAction, ICustomer, reducer as customerReducer } from './sagas/customer';
import { AppointmentAction, IAppointment, reducer as appointmentReducer } from './reducers/appointment';
import { customerAdded } from './sagas/app';

function* rootSaga() {
    yield all([
        takeLatest('ADD_CUSTOMER_REQUEST', addCustomer),
        takeLatest('ADD_CUSTOMER_SUCCESSFUL', customerAdded),
        takeLatest('QUERY_CUSTOMER_REQUEST', queryCustomer)
    ]);
}

export const configureStore = (storeEnhancers = [] as StoreEnhancer[]) => {
    const sagaMiddleware = createSagaMiddleware();
    const store: StoreWithSpy<RootState, RootAction> = createStore(
        combineReducers({
            customer: customerReducer,
            appointment: appointmentReducer,
            queryCustomer: queryCustomerReducer
        }),
        compose(
            ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
        )
    );

    sagaMiddleware.run(rootSaga);

    return store;
};

export type RootState = { customer: ICustomer, appointment: IAppointment, queryCustomer: IQueryCustomer };
export type RootAction = CustomerAction | AppointmentAction | QueryCustomerAction;