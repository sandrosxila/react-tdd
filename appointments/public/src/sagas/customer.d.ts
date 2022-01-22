import { CallEffect, PutEffect } from 'redux-saga/effects';
export declare function addCustomer({ customer }: {
    customer: object;
    type: CustomerAction;
}): Generator<PutEffect | CallEffect, void, Response | {
    errors?: object;
}>;
export declare type ICustomer = {
    customer: object;
    status?: 'SUBMITTING' | 'FAILED' | 'VALIDATION_FAILED' | 'SUCCESSFUL';
    validationErrors?: object;
    error: boolean;
};
declare type AddCustomerRequest = {
    type: 'ADD_CUSTOMER_REQUEST';
};
declare type AddCustomerSubmitting = {
    type: 'ADD_CUSTOMER_SUBMITTING';
};
declare type AddCustomerFailed = {
    type: 'ADD_CUSTOMER_FAILED';
};
declare type AddCustomerValidationFailed = {
    type: 'ADD_CUSTOMER_VALIDATION_FAILED';
    validationErrors: ICustomer['validationErrors'];
};
declare type AddCustomerSuccessful = {
    type: 'ADD_CUSTOMER_SUCCESSFUL';
    customer: ICustomer['customer'];
};
export declare type CustomerAction = AddCustomerRequest | AddCustomerSubmitting | AddCustomerFailed | AddCustomerValidationFailed | AddCustomerSuccessful;
export declare const reducer: (state: ICustomer | undefined, action: CustomerAction) => ICustomer;
export declare type CustomerReducer = typeof reducer;
export {};
