declare global {
    interface Array<T> {
        unique(): T[];
        pickRandom(): T;
    }
}
export declare const sampleAppointments: {
    customer: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    stylist: string;
    service: string;
    notes: string;
    startsAt: number;
}[];
export declare const sampleAvailableTimeSlots: {
    startsAt: number;
}[];
