import React, { FC, useEffect, useState } from 'react';
import { AppointmentsDayView } from './AppointmentsDayView';

type Props = {
    today?: Date
}

export const AppointmentsDayViewLoader: FC<Props> = ({
    today = new Date(),
}) => {

    const [appointments, setAppointments] = useState<{ startsAt: number }[]>([]);

    useEffect(() => {
        const from = today.setHours(0, 0, 0, 0);
        const to = today.setHours(23, 59, 59, 999);

        const fetchAppointments = async () => {
            const result = await window.fetch(
                `/appointments/${from}-${to}`, {
                    method:'GET',
                    credentials:'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            setAppointments(await result.json());
        };

        fetchAppointments();
    }, [today]);



    return (
        <AppointmentsDayView appointments={ appointments as any } />
    );
};

export default AppointmentsDayViewLoader;
