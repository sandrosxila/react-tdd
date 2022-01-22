import React from 'react';
import 'whatwg-fetch';
import { Container, createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import AppointmentFormLoader from '../src/AppointmentFormLoader';
import * as AppointmentFormExports from '../src/AppointmentForm';

describe('AppointmentFormLoader', () => {
    let renderAndWait: Container['renderAndWait'];

    let spyOnFetch: jest.SpyInstance;
    let spyOnAppointmentForm: jest.SpyInstance;


    const today = new Date();
    const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0), stylists: [] }
    ];

    beforeEach(() => {
        ({ renderAndWait } = createContainer());
        spyOnFetch = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(availableTimeSlots));
        spyOnAppointmentForm = jest.spyOn(AppointmentFormExports, 'AppointmentForm').mockReturnValue(null);
    });
    afterEach(() => {
        spyOnFetch.mockRestore();
        spyOnAppointmentForm.mockRestore();
    });

    it('fetches data when component is mounted', async () => {
        await renderAndWait(<AppointmentFormLoader/>);
        
        expect(spyOnFetch).toHaveBeenCalledWith(
            '/availableTimeSlots',
            expect.objectContaining({
                method: 'GET',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            })
        );
    });

    it('initially passes no data to AppointmentForm', async () => {
        await renderAndWait(<AppointmentFormLoader/>);
        expect(
            AppointmentFormExports.AppointmentForm
        ).toHaveBeenCalledWith(
            { availableTimeSlots: [] },
            expect.anything()
        );
    });

    it('displays time slots that are fetched on mount', async () => {
        await renderAndWait(<AppointmentFormLoader/>);

        expect(
            AppointmentFormExports.AppointmentForm
        ).toHaveBeenCalledWith(
            { availableTimeSlots },
            expect.anything()
        );

    });


    it('passes props through to children', async () => {
        await renderAndWait(<AppointmentFormLoader testProp={ 123 } />);
        expect(
            AppointmentFormExports.AppointmentForm
        ).toHaveBeenCalledWith(
            expect.objectContaining({ testProp: 123 }),
            expect.anything()
        );
    });

});