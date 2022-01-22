import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';

const toTimeString = (startsAt: number) =>
    new Date(startsAt).toString().substring(0, 21);

const AppointmentRow: FC<{
    appointment: { 
        startsAt: number, 
        stylist: string, 
        service: string, 
        notes: string
    } 
}> = ({ appointment }) => (
    <tr>
        <td>{ toTimeString(appointment.startsAt) }</td>
        <td>{ appointment.stylist }</td>
        <td>{ appointment.service }</td>
        <td>{ appointment.notes }</td>
    </tr>
);

type Props = {
    id: string
}

export const CustomerHistory: FC<Props> = ({ id }) => {

    const dispatch = useDispatch();
    const { customer, appointments, status } = useSelector((state: RootState) => state.queryCustomer);

    const queryCustomer = useCallback((id: string) => {
        dispatch({ type: 'QUERY_CUSTOMER_REQUEST', id });
    }, [dispatch]);

    useEffect(() => {
        queryCustomer(id);
    }, [id, queryCustomer]);

    const { firstName, lastName, phoneNumber } = customer;

    if (status === 'SUBMITTING')
        return <div id='loading'>Loading</div>;

    if (status === 'FAILED')
        return (
            <div id='error'>
                Sorry, an error occurred while pulling data from the server.
            </div>
        );

    return (
        <div id="customer">
            <h2>
                { firstName } { lastName }
            </h2>
            <p>
                { phoneNumber }
            </p>
            <h3>Booked appointments</h3>
            <table>
                <thead>
                    <tr>
                        <th>When</th>
                        <th>Stylist</th>
                        <th>Service</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        appointments.map((appointment, i) => (
                            <AppointmentRow appointment={ appointment } key={ i } />
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};