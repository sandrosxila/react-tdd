import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Customer } from './AppointmentsDayView';
import { required, match, list, hasError, validateMany, anyErrors } from './formValidation';
import { RootState } from './store';

type Props = {
    firstName?: string,
    lastName?: string,
    phoneNumber?: string
}
const CustomerForm: React.FC<Props> = ({ firstName = '', lastName = '', phoneNumber = '' }) => {
    const dispatch = useDispatch();
    
    const { status, validationErrors : serverValidationErrors, error } = useSelector((state: RootState) => state.customer);
    const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber });
    const [validationErrors, setValidationErrors] = useState<{ [key in keyof typeof customer]?: string }>({});
    const submitting = status === 'SUBMITTING';

    const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer(
            customer => ({
                ...customer,
                [target.name as keyof typeof customer]: target.value
            })
        );
        if(hasError(validationErrors, target.name as keyof typeof customer)){
            validateSingleField(target.name as keyof typeof customer, target.value);
        }
    };

    const validators = {
        firstName: required('First name is required'),
        lastName: required('Last name is required'),
        phoneNumber: list(
            required('Phone number is required'), 
            match(/^[0-9+()\- ]*$/, 'Only numbers, spaces and these symbols are allowed: ( ) + -')
        ),
    };

    const validateSingleField = (fieldName: keyof typeof customer, fieldValue: string) => {
        const result = validateMany(validators, { [fieldName] : fieldValue });
        setValidationErrors({
            ...validationErrors,
            ...result
        });
    };

    const handleBlur = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        validateSingleField(target.name as keyof typeof customer, target.value);
    };

    const renderError = (fieldName: keyof typeof customer) => {
        const allValidationErrors = {
            firstName: serverValidationErrors.firstName || validationErrors.firstName,
            lastName: serverValidationErrors.lastName || validationErrors.lastName,
            phoneNumber: serverValidationErrors.phoneNumber || validationErrors.phoneNumber,
        };

        if(hasError(allValidationErrors, fieldName)){
            return (
                <span className="error">
                    {
                        allValidationErrors[fieldName]
                    }
                </span>
            );
        }
    };

    const addCustomerRequest = (customer: Customer) => ({
        type: 'ADD_CUSTOMER_REQUEST' as const,
        customer
    });

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const validationResult = validateMany(validators, customer);

        if(!anyErrors(validationResult)){
            dispatch(addCustomerRequest(customer));
        }
        else{
            setValidationErrors(validationResult);
        }
    };

    return (
        <form id="customer" onSubmit={ handleSubmit }>
            { error && <Error /> }
            <label htmlFor="firstName">First Name</label>
            <input
                type="text"
                name="firstName"
                id="firstName"
                value={ customer.firstName }
                onChange={ handleChange }
                onBlur={ handleBlur }
            />
            { renderError('firstName') }
            <label htmlFor="lastName">Last Name</label>
            <input
                type="text"
                name="lastName"
                id="lastName"
                value={ customer.lastName }
                onChange={ handleChange }
                onBlur={ handleBlur }
            />
            { renderError('lastName') }
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={ customer.phoneNumber }
                onChange={ handleChange }
                onBlur={ handleBlur }
            />
            { renderError('phoneNumber') }
            <input type="submit" value="Add" disabled={ submitting }/>
            { submitting && <span className="submittingIndicator" /> }
            
        </form>
    );
};

const Error = () => (
    <div className="error">An error occurred during save.</div>
);

export default CustomerForm;