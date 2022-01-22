import React, { FC } from 'react';
export declare type Customer = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
};
declare type Appointment = {
    startsAt: number;
    customer: Customer;
    stylist: string;
    service: string;
    notes: string;
};
declare type Props = {
    appointments: Appointment[];
};
export declare const Appointment: React.FC<{
    [k in keyof Appointment]+?: Appointment[k];
}>;
export declare const AppointmentsDayView: FC<Props>;
export default AppointmentsDayView;
