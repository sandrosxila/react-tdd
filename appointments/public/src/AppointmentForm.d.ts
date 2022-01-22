import { FC } from 'react';
declare type Props = {
    selectableServices?: string[];
    service?: string;
    salonOpensAt?: number;
    salonClosesAt?: number;
    selectableStylists?: string[];
    stylist?: string;
    serviceStylists?: {
        [key in string]: string[];
    };
    today?: Date;
    availableTimeSlots?: {
        startsAt: number;
        stylists: string[];
    }[];
    startsAt?: number;
    onSubmit?: (prop: {
        service?: string;
        startsAt?: number;
    }) => void;
    onSave?: any;
    customer?: {
        id: string;
    };
};
export declare const AppointmentForm: FC<Props>;
export default AppointmentForm;
