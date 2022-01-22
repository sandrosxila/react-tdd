import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const Error = () => (
    <div className="error">An error occurred during save.</div>
);

const timeIncrements = (numTimes: number, startTime: number, increment: number) =>
    Array<number[]>(numTimes)
        .fill([startTime])
        .reduce((acc, _, i) =>
            acc.concat([startTime + i * increment])
        );

const dailyTimeSlots = (salonOpensAt: number, salonClosesAt: number) => {
    const totalSlots = Math.abs(salonOpensAt - salonClosesAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;

    return timeIncrements(totalSlots, startTime, increment);
};

const weeklyDateValues = (startDate: Date) => {
    const midnight = new Date(startDate).setHours(0, 0, 0, 0);
    const increment = 24 * 60 * 60 * 1000;

    return timeIncrements(7, midnight, increment);
};

const toShortDate = (timestamp: number) => {
    const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(' ');
    return `${day} ${dayOfMonth}`;
};

const toTimeValue = (timestamp: number) => new Date(timestamp).toTimeString().substring(0, 5);

const mergeDateAndTime = (date: number, timeSlot: number) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
    );
};

const RadioButtonIfAvailable: FC<{
    timeSlot: number,
    checkedTimeSlot: number,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    date: number,
    availableTimeSlots: {
        startsAt: number
    }[],
}> = ({
    availableTimeSlots,
    date,
    timeSlot,
    checkedTimeSlot,
    handleChange
}) => {
    const startsAt = mergeDateAndTime(date, timeSlot);
    if (availableTimeSlots.some(a => a.startsAt === startsAt)) {
        const isChecked = startsAt === checkedTimeSlot;
        return (
            <input
                name="startsAt"
                type="radio"
                value={ startsAt }
                checked={ isChecked }
                onChange={ handleChange }
            />
        );
    }
    return null;
};

type TimeSlotTableProps = {
    salonOpensAt: number,
    salonClosesAt: number,
    today: Date,
    availableTimeSlots: {
        startsAt: number
    }[],
    checkedTimeSlot: number,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TimeSlotTable: FC<TimeSlotTableProps> = ({
    salonOpensAt,
    salonClosesAt,
    today,
    availableTimeSlots,
    checkedTimeSlot,
    handleChange
}) => {
    const dates = weeklyDateValues(today);
    const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
    return (
        <table id="time-slots">
            <thead>
                <tr>
                    <th />
                    {
                        dates.map(d => (
                            <th key={ d }>{ toShortDate(d) }</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    timeSlots.map(timeSlot => (
                        <tr key={ timeSlot }>
                            <th>{ toTimeValue(timeSlot) }</th>
                            {
                                dates.map(date => (
                                    <td key={ date }>
                                        <RadioButtonIfAvailable
                                            availableTimeSlots={ availableTimeSlots }
                                            date={ date }
                                            timeSlot={ timeSlot }
                                            checkedTimeSlot={ checkedTimeSlot }
                                            handleChange={ handleChange }
                                        />
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};
  

type Props = {
    selectableServices?: string[],
    service?: string,
    salonOpensAt?: number,
    salonClosesAt?: number,
    selectableStylists?: string[],
    stylist?: string,
    serviceStylists?: {
        [key in string]: string[]
    }
    today?: Date,
    availableTimeSlots?: {
        startsAt: number,
        stylists: string[]
    }[],
    startsAt?: number,
    onSubmit?: (prop: { service?: string, startsAt?: number }) => void,
    onSave?: any,
    customer?: { id: string }
}

export const AppointmentForm: FC<Props> = ({
    availableTimeSlots = [],
    today = new Date(),
    salonOpensAt = 9,
    salonClosesAt = 11,
    selectableServices = [
        'Cut',
        'Blow-dry',
        'Cut & color',
        'Beard trim',
        'Cut & beard trim',
        'Extensions'
    ],
    selectableStylists = ['Ashley', 'Jo', 'Pat', 'Sam'],
    serviceStylists = {
        Cut: ['Ashley', 'Jo', 'Pat', 'Sam'],
        'Blow-dry': ['Ashley', 'Jo', 'Pat', 'Sam'],
        'Cut & color': ['Ashley', 'Jo'],
        'Beard trim': ['Pat', 'Sam'],
        'Cut & beard trim': ['Pat', 'Sam'],
        Extensions: ['Ashley', 'Pat']
    },
    onSave = () => void(0),
    service = '',
    stylist = '',
    startsAt = 0
}) => {
    const { customer } = useSelector((state: RootState) => state.appointment);
    const [error, setError] = useState(false);

    const [appointment, setAppointment] = useState({
        service,
        startsAt,
        stylist
    });

    const handleSelectBoxChange = ({ target: { value, name } }: React.ChangeEvent<HTMLSelectElement>) =>
        setAppointment(appointment => ({
            ...appointment,
            [name]: value
        }));

    const handleStartsAtChange = useCallback(
        ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
            setAppointment(appointment => ({
                ...appointment,
                startsAt: parseInt(value)
            })),
        []
    );

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const result = await window.fetch('/appointments', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...appointment,
                customer: customer!.id
            })
        });
        if (result.ok) {
            setError(false);
            onSave();
        } else {
            setError(true);
        }
    };

    const stylistsForService = appointment.service
        ? serviceStylists![appointment.service]
        : selectableStylists;

    const timeSlotsForStylist = appointment.stylist
        ? availableTimeSlots!.filter(slot =>
            slot.stylists.includes(appointment.stylist!)
        )
        : availableTimeSlots;

    return (
        <form id="appointment" onSubmit={ handleSubmit }>
            { error ? <Error /> : null }
            <label htmlFor="service">Salon service</label>
            <select
                name="service"
                id="service"
                value={ service }
                onChange={ handleSelectBoxChange }>
                <option />
                {
                    selectableServices!.map(s => (
                        <option key={ s }>{ s }</option>
                    ))
                }
            </select>

            <label htmlFor="stylist">Stylist</label>
            <select
                name="stylist"
                id="stylist"
                value={ stylist }
                onChange={ handleSelectBoxChange }>
                <option />
                {
                    stylistsForService!.map(s => (
                        <option key={ s }>{ s }</option>
                    ))
                }
            </select>

            <TimeSlotTable
                salonOpensAt={ salonOpensAt }
                salonClosesAt={ salonClosesAt }
                today={ today }
                availableTimeSlots={ timeSlotsForStylist }
                checkedTimeSlot={ appointment.startsAt }
                handleChange={ handleStartsAtChange }
            />

            <input type="submit" value="Add" />
        </form>
    );
};


export default AppointmentForm;