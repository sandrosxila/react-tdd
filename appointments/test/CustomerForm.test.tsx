import React from 'react';
import { act } from 'react-dom/test-utils';
import { withEvent, ContainerWithStore, createContainerWithStore } from './domManipulators';
import CustomerForm from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from './spyHelpers';
import 'whatwg-fetch';
import { expectRedux } from 'expect-redux';

describe('CustomerForm', () => {

    let renderWithStore: ContainerWithStore['renderWithStore'];
    let store: ContainerWithStore['store'];
    let form: ContainerWithStore['form'];
    let field: ContainerWithStore['field'];
    let labelFor: ContainerWithStore['labelFor'];
    let element: ContainerWithStore['element'];
    let change: ContainerWithStore['change'];
    let submit: ContainerWithStore['submit'];
    let blur: ContainerWithStore['blur'];

    let spyOnFetch: jest.SpyInstance<Promise<Response>, [input: RequestInfo, init?: RequestInit | undefined]>;

    beforeEach(() => {
        ({ renderWithStore, store, form, field, labelFor, element, change, submit, blur } = createContainerWithStore());
        spyOnFetch = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk({}));
    });

    afterEach(() => {
        spyOnFetch.mockRestore();
    });

    const validCustomer = {
        firstName: 'first',
        lastName: 'last',
        phoneNumber: '123456789'
    };

    interface FormElements extends HTMLFormControlsCollection {
        firstName: HTMLInputElement,
        lastName: HTMLInputElement,
        phoneNumber: HTMLInputElement
    }

    type FieldName = Exclude<keyof FormElements, keyof HTMLFormControlsCollection>;

    const expectToBeInputFieldOfTypeText = (element: HTMLInputElement) => {
        expect(element).not.toBeNull();
        expect(element.tagName).toEqual('INPUT');
        expect(element.type).toEqual('text');
    };

    const itRendersAsATextBox = (fieldName: FieldName) => {
        // eslint-disable-next-line jest/expect-expect
        it('renders as a text box', () => {
            renderWithStore(<CustomerForm />);
            expectToBeInputFieldOfTypeText(field<FormElements>('customer', fieldName));
        });
    };

    const itIncludesTheExistingValue = (fieldName: FieldName) => {
        it('includes the existing value', () => {
            renderWithStore(<CustomerForm { ...{ [fieldName]: 'value' } } />);
            expect(field<FormElements>('customer', fieldName).value).toEqual('value');
        });
    };

    const itRendersALabel = (fieldName: FieldName, value: string) => {
        it('renders a label', () => {
            renderWithStore(<CustomerForm />);
            expect(labelFor(fieldName)).not.toBeNull();
            expect(labelFor(fieldName)?.textContent).toBe(value);
        });
    };

    const itAssignsAnIdThatMatchesTheLabelId = (fieldName: FieldName) => {
        it('assigns an id that matches the label id', () => {
            renderWithStore(<CustomerForm />);
            expect(field<FormElements>('customer', fieldName).id).toEqual(fieldName);
        });
    };

    const itSubmitsExistingValue = (fieldName: FieldName) => {
        it('saves existing value when submitted', () => {

            renderWithStore(
                <CustomerForm
                    { ...validCustomer } 
                    { ...{ [fieldName]: '123' } }
                />
            );
            submit(form('customer')!);
            expect(requestBodyOf(spyOnFetch)).toMatchObject({
                [fieldName]: '123'
            });
        });
    };

    const itSubmitsNewValue = (fieldName: FieldName, value: string) => {
        it('saves new value when submitted', () => {
            renderWithStore(
                <CustomerForm
                    { ...validCustomer } 
                    { ...{ [fieldName]: 'existingValue' } }
                />
            );
            change(field<FormElements>('customer', fieldName), 
                withEvent<FormElements[FieldName]>(fieldName, value)
            );
            submit(form('customer')!);
            expect(requestBodyOf(spyOnFetch)).toMatchObject({
                [fieldName]: value
            });
        });
    };

    it('renders a form', () => {
        renderWithStore(<CustomerForm />);
        expect(form('customer')).not.toBeNull();
    });

    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName');
        itRendersALabel('firstName', 'First Name');
        itAssignsAnIdThatMatchesTheLabelId('firstName');
        itSubmitsExistingValue('firstName');
        itSubmitsNewValue('firstName', 'anotherFirstName');
    });

    describe('last name field', () => {
        itRendersAsATextBox('lastName');
        itIncludesTheExistingValue('lastName');
        itRendersALabel('lastName', 'Last Name');
        itAssignsAnIdThatMatchesTheLabelId('lastName');
        itSubmitsExistingValue('lastName');
        itSubmitsNewValue('lastName', 'anotherLastName');
    });

    describe('phone number field', () => {
        itRendersAsATextBox('phoneNumber');
        itIncludesTheExistingValue('phoneNumber');
        itRendersALabel('phoneNumber', 'Phone Number');
        itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
        itSubmitsExistingValue('phoneNumber');
        itSubmitsNewValue('phoneNumber', '+1213456');
    });


    it('has a submit button', () => {
        renderWithStore(<CustomerForm />);
        const submitButton = element('input[type="submit"]');
        expect(submitButton).not.toBeNull();
    });

    // eslint-disable-next-line jest/expect-expect
    it('does not submit the form when there are validation errors', async () => {
        renderWithStore(<CustomerForm/>);

        await submit(form('customer')!);

        return expectRedux(store).toNotDispatchAnAction(100).ofType('ADD_CUSTOMER_REQUEST');
    });

    it('renders validation errors after submission fails', async() => {
        renderWithStore(<CustomerForm/>);
        await submit(form('customer')!);
        expect(spyOnFetch).not.toHaveBeenCalled();
        expect(element('.error')).not.toBeNull();
    });

    // eslint-disable-next-line jest/expect-expect
    it('calls fetch with the right properties when submitting data', async () => {
        renderWithStore(
            <CustomerForm { ...validCustomer } />
        );

        submit(form('customer')!);

        return expectRedux(store).toDispatchAnAction().matching(
            {
                type: 'ADD_CUSTOMER_REQUEST',
                customer: validCustomer
            }
        );
    });

    it('prevents the default action when submitting the form', async () => {
        const preventDefaultSpy = jest.fn();
        renderWithStore(<CustomerForm { ...validCustomer } />);
        await act(async () => {
            submit(form('customer')!, {
                preventDefault: preventDefaultSpy
            });
        });
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('renders error message when fetch call fails', async () => {
        spyOnFetch.mockReturnValue(fetchResponseError());
        renderWithStore(<CustomerForm { ...validCustomer } />);
        store.dispatch({ type: 'ADD_CUSTOMER_FAILED' });
        expect(element('.error')?.textContent).toMatch('error occurred');
    });


    const itInvalidatesFieldWithValue = (fieldName: FieldName, value: string, description: string) => {
        it(`displays error after blur when ${fieldName} field is blank`, () => {
            renderWithStore(<CustomerForm/>);
    
            blur(field<FormElements>('customer', fieldName), withEvent<FormElements[FieldName]>(fieldName, value));
    
            expect(element('.error')).not.toBeNull();
            expect(element('.error')?.textContent).toMatch(description);
        });
    };

    itInvalidatesFieldWithValue('firstName', ' ', 'First name is required');
    itInvalidatesFieldWithValue('lastName', ' ', 'Last name is required');
    itInvalidatesFieldWithValue('phoneNumber', ' ', 'Phone number is required');
    itInvalidatesFieldWithValue('phoneNumber', 'invalid', 'Only numbers, spaces and these symbols are allowed: ( ) + -');



    it('renders field validation errors from server', () => {
        const errors = {
            phoneNumber: 'Phone number already exists in the system'
        };

        renderWithStore(<CustomerForm { ...validCustomer } />);

        store.dispatch({
            type: 'ADD_CUSTOMER_VALIDATION_FAILED',
            validationErrors: errors
        });

        expect(element('.error')?.textContent).toMatch(
            errors.phoneNumber
        );
    });

    it('displays indicator when form is submitting', () => {
        renderWithStore(<CustomerForm { ...validCustomer }/>);
        store.dispatch({ type: 'ADD_CUSTOMER_SUBMITTING' });
        expect(element('span.submittingIndicator')).not.toBeNull();
    });

    it('disables the submit button when submitting', () => {
        renderWithStore(<CustomerForm { ...validCustomer }/>);
        store.dispatch({ type: 'ADD_CUSTOMER_SUBMITTING' });
        expect(element<HTMLInputElement>('input[type=submit]')?.disabled).toBe(true);
    });

    it('initially does not display the submitting indicator', () => {
        renderWithStore(<CustomerForm { ...validCustomer } />);
        expect(element('.submittingIndicator')).toBeNull();
    });


    it('hides indicator when form has submitted', async () => {
        renderWithStore(<CustomerForm { ...validCustomer } />);
        store.dispatch({ type: 'ADD_CUSTOMER_SUCCESSFUL', customer: { ...validCustomer } });
        expect(element('.submittingIndicator')).toBeNull();
    });

    describe('validation', () => {

        const itInvalidatesFieldWithValue = (fieldName: FieldName, value: string, description: string) => {
            it(`displays error after blur when ${fieldName} field is blank`, () => {
                renderWithStore(<CustomerForm/>);
        
                blur(field<FormElements>('customer', fieldName), withEvent<FormElements[FieldName]>(fieldName, value));
        
                expect(element('.error')).not.toBeNull();
                expect(element('.error')?.textContent).toMatch(description);
            });
        };
    
        const itClearsFieldError = (fieldName: FieldName, fieldValue: string) => {
            it('clears error when user corrects it', async () => {
                renderWithStore(<CustomerForm { ...validCustomer } />);
    
                blur(
                    field<FormElements>('customer', fieldName),
                    withEvent<FormElements[FieldName]>(fieldName, '')
                );
                change(
                    field<FormElements>('customer', fieldName),
                    withEvent<FormElements[FieldName]>(fieldName, fieldValue)
                );
    
                expect(element('.error')).toBeNull();
            });
        };
    
        const itDoesNotInvalidateFieldOnKeypress = (fieldName: FieldName, fieldValue: string) => {
            it('does not validate field on keypress', async () => {
                renderWithStore(<CustomerForm { ...validCustomer } />);
    
                change(
                    field<FormElements>('customer', fieldName),
                    withEvent<FormElements[FieldName]>(fieldName, fieldValue)
                );
    
                expect(element('.error')).toBeNull();
            });
        };

        itInvalidatesFieldWithValue('firstName', ' ', 'First name is required');
        itInvalidatesFieldWithValue('lastName', ' ', 'Last name is required');
        itInvalidatesFieldWithValue('phoneNumber', ' ', 'Phone number is required');
        itInvalidatesFieldWithValue('phoneNumber', 'invalid', 'Only numbers, spaces and these symbols are allowed: ( ) + -');

        itClearsFieldError('firstName', 'name');
        itClearsFieldError('lastName', 'name');
        itClearsFieldError('phoneNumber', '1234567890');
    
        itDoesNotInvalidateFieldOnKeypress('firstName', '');
        itDoesNotInvalidateFieldOnKeypress('lastName', '');
        itDoesNotInvalidateFieldOnKeypress('phoneNumber', '');
    
        it('accepts standard phone number characters when validating', () => {
            renderWithStore(<CustomerForm/>);
    
            blur(
                element<FormElements['phoneNumber']>('[name="phoneNumber"]')!,
                withEvent<FormElements['phoneNumber']>('phoneNumber', '0123456789+()- ')
            );
            expect(element('.error')).toBeNull();
        });
    });
});

