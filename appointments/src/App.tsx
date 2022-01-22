import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import AppointmentFormLoader from './AppointmentFormLoader';
import AppointmentsDayViewLoader from './AppointmentsDayViewLoader';
import CustomerForm from './CustomerForm';
import { CustomerHistory } from './CustomerHistory';
import { CustomerSearch } from './CustomerSearch/CustomerSearch';

export const MainScreen = () => (
    <React.Fragment>
        <div className="button-bar">
            <Link to="/addCustomer" className="button">
                Add customer and appointment
            </Link>
            <Link to="/searchCustomers" className="button">
                Search customers
            </Link>
        </div>
        <AppointmentsDayViewLoader />
    </React.Fragment>
);

const App = () => {
    const dispatch = useDispatch();
    const setCustomerForAppointment = useCallback((customer: { id: string }) => {
        dispatch({
            type: 'SET_CUSTOMER_FOR_APPOINTMENT',
            customer
        });
    }, [dispatch]);

    const navigate = useNavigate();

    const transitionToAddAppointment = useCallback((customer: { id: string }) => {
        setCustomerForAppointment(customer);
        navigate('/addAppointment');
    }, [navigate, setCustomerForAppointment]);

    const transitionToDayView = useCallback(() => {
        navigate('/');
    }, [navigate]);


    const searchActions = (customer: { id: string, firstName: string, lastName: string, phoneNumber: string }) => (
        <React.Fragment>
            <button 
                role="button" 
                onClick={ () => transitionToAddAppointment(customer) }>
                Create appointment
            </button>
            <button role="button" onClick={ () => transitionToCustomerHistory(customer) }>View history</button>
        </React.Fragment>
    );

    const transitionToCustomerHistory = (customer: { id: string, firstName: string, lastName: string, phoneNumber: string }) =>
        navigate(`/customer/${customer.id}`);

    return (
        <Routes>
            <Route
                path="/addCustomer"
                element={ <CustomerForm/> }
            />
            <Route
                path="/addAppointment"
                element={ 
                    <AppointmentFormLoader
                        onSave={ transitionToDayView }
                    />
                }
            />
            <Route
                path="/searchCustomers"
                element={
                    <CustomerSearch
                        renderCustomerActions={ searchActions }
                    />
                }
            />

            <Route
                path="/customer/:id"
                element ={ <CustomerHistory id={ '123' } /> }
            />

            <Route path="*" element={ <MainScreen/> } />
        </Routes>
    );

};

export default App;
