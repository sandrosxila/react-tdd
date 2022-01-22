import { call, CallEffect, put, PutEffect } from 'redux-saga/effects';

const fetch = (url: string, data: object) =>
    window.fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        credentials: 'same-origin',
        headers:{
            'Content-Type': 'application/json'
        }
    });

export function* addCustomer(
    { customer }: 
    { 
        customer: object, 
        type: CustomerAction 
    }): Generator<PutEffect | CallEffect, void, Response | { errors?: object }> {
    yield put({ type: 'ADD_CUSTOMER_SUBMITTING' });
    const result = yield call(fetch, '/customers', customer);

    if('ok' in result && result.ok){
        const customerWithId = yield call([result, 'json']);
        yield put({
            type: 'ADD_CUSTOMER_SUCCESSFUL',
            customer: customerWithId
        });
    } 
    else if ('status' in result && result.status === 422) {
        const response = yield call([(result as Response), 'json']);

        if('errors' in response){
            yield put({
                type: 'ADD_CUSTOMER_VALIDATION_FAILED',
                validationErrors: response.errors
            });
        }
    }
    else{
        yield put({ type: 'ADD_CUSTOMER_FAILED' });
    }
}

export type ICustomer = {
    customer: object,
    status?: 'SUBMITTING' | 'FAILED' | 'VALIDATION_FAILED' | 'SUCCESSFUL',
    validationErrors: {
        firstName?: string,
        lastName?: string,
        phoneNumber?: string
    },
    error: boolean
}

const defaultState: ICustomer = {
    customer: {},
    status: undefined,
    validationErrors: {
        firstName: undefined,
        lastName: undefined,
        phoneNumber: undefined
    },
    error: false
};

type AddCustomerRequest = {
    type: 'ADD_CUSTOMER_REQUEST'
}

type AddCustomerSubmitting = {
    type: 'ADD_CUSTOMER_SUBMITTING'
}

type AddCustomerFailed = {
    type: 'ADD_CUSTOMER_FAILED'
}

type AddCustomerValidationFailed = {
    type: 'ADD_CUSTOMER_VALIDATION_FAILED',
    validationErrors: ICustomer['validationErrors']
}; 

type AddCustomerSuccessful = {
    type: 'ADD_CUSTOMER_SUCCESSFUL',
    customer: ICustomer['customer']
};

export type CustomerAction = AddCustomerRequest | AddCustomerSubmitting | AddCustomerFailed | AddCustomerValidationFailed | AddCustomerSuccessful;

export const reducer = (state = defaultState, action: CustomerAction): ICustomer => {
    switch(action.type) {
        case 'ADD_CUSTOMER_SUBMITTING':
            return { ...state, status: 'SUBMITTING' };
        case 'ADD_CUSTOMER_FAILED':
            return { ...state, status: 'FAILED', error: true };
        case 'ADD_CUSTOMER_VALIDATION_FAILED':
            return { ...state, status: 'VALIDATION_FAILED', validationErrors: action.validationErrors };
        case 'ADD_CUSTOMER_SUCCESSFUL':
            return { ...state, status: 'SUCCESSFUL', customer: action.customer, error: false, validationErrors: {} };
        default:
            return state;
    }
};

export type CustomerReducer = typeof reducer;