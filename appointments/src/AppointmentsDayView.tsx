import React, { FC, useState } from 'react';

export type Customer = {
    firstName: string,
    lastName: string,
    phoneNumber: string,
}

type Appointment = {
    startsAt: number,
    customer: Customer,
    stylist: string,
    service: string,
    notes: string
}

type Props = {
    appointments: Appointment[]
}

const appointmentTimeOfDay = (startsAt: number) => {
    const [h, m] = new Date(startsAt).toTimeString().split(':');
    return `${h}:${m}`;
};

export const Appointment: React.FC<{ [k in keyof Appointment]+?: Appointment[k] }> = ({ 
    customer = { firstName:'', lastName:'', phoneNumber:'' },
    startsAt = 0, 
    stylist = '', 
    service = '', 
    notes = '' 
}) => {
    return (
        <div id="appointmentView">
            <h3>
                Today&apos;s appointment at { appointmentTimeOfDay(startsAt) }
            </h3>
            <table>
                <tbody>
                    <tr>
                        <td>Customer</td>
                        <td>
                            { customer.firstName } { customer.lastName }
                        </td>
                    </tr>
                    <tr>
                        <td>Phone number</td>
                        <td>{ customer.phoneNumber }</td>
                    </tr>
                    <tr>
                        <td>Stylist</td>
                        <td>{ stylist }</td>
                    </tr>
                    <tr>
                        <td>Service</td>
                        <td>{ service }</td>
                    </tr>
                    <tr>
                        <td>Notes</td>
                        <td>{ notes }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export const AppointmentsDayView: FC<Props> = ({ appointments = [] }) => {
    const [selectedAppointment, setSelectedAppointment] = useState(0);

    return (
        <div id="appointmentsDayView">
            <ol>
                {
                    appointments.map((appointment, idx) => (
                        <li key={ appointment.startsAt }>
                            <button
                                className={ idx === selectedAppointment ? 'toggled' : '' }
                                type="button"
                                onClick={ () => setSelectedAppointment(idx) }
                            >
                                { appointmentTimeOfDay(appointment.startsAt) }
                            </button>
                        </li>
                    )
                    )
                }
            </ol>
            {
                appointments.length === 0 ?
                    <p>There are no appointments scheduled for today.</p>
                    :
                    <Appointment { ...appointments[selectedAppointment] } />
            }
        </div>
    );
};

export default AppointmentsDayView;
