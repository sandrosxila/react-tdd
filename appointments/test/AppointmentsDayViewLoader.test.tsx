import React from 'react';
import 'whatwg-fetch';
import { Container, createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import {
    AppointmentsDayViewLoader
} from '../src/AppointmentsDayViewLoader';
import * as AppointmentsDayViewExports
    from '../src/AppointmentsDayView';
jest.mock('relay-runtime');

describe('AppointmentFormLoader', () => {
    let renderAndWait: Container['renderAndWait'];

    let spyOnFetch: jest.SpyInstance;
    let spyOnAppointmentsDayView: jest.SpyInstance;


    const today = new Date();
    const appointments = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(10, 0, 0, 0) },
    ];

    beforeEach(() => {
        ({ renderAndWait } = createContainer());
        spyOnFetch = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(appointments));
        spyOnAppointmentsDayView = jest.spyOn(AppointmentsDayViewExports, 'AppointmentsDayView').mockReturnValue(null);
    });

    afterEach(() => {
        spyOnFetch.mockRestore();
        spyOnAppointmentsDayView.mockRestore();
    });

    it('fetches appointments happening today when component is mounted', async () => {
        const from = today.setHours(0, 0, 0, 0);
        const to = today.setHours(23, 59, 59, 999);

        await renderAndWait(
            <AppointmentsDayViewLoader today={ today } />
        );

        expect(spyOnFetch).toHaveBeenCalledWith(
            `/appointments/${from}-${to}`,
            expect.objectContaining({
                method:'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        );
    });

    it('initially passes no data to AppointmentsDayView', async () => {
        await renderAndWait(<AppointmentsDayViewLoader />);

        expect(spyOnAppointmentsDayView).toHaveBeenCalledWith(
            { appointments: [] },
            expect.anything()
        );
    });

    it('displays time slots that are fetched on mount', async () => {
        await renderAndWait(<AppointmentsDayViewLoader />);

        expect(spyOnAppointmentsDayView).toHaveBeenCalledWith(
            {
                appointments
            },
            expect.anything()
        );
    });

    it('re-requests appointment when today prop changes', async () => {
        const tomorrow = new Date(today);
        tomorrow.setHours(24);
        const from = tomorrow.setHours(0, 0, 0, 0);
        const to = tomorrow.setHours(23, 59, 59, 999);

        await renderAndWait(
            <AppointmentsDayViewLoader today={ today } />
        );
        await renderAndWait(
            <AppointmentsDayViewLoader today={ tomorrow } />
        );
        expect(window.fetch).toHaveBeenLastCalledWith(
            `/appointments/${from}-${to}`,
            expect.anything()
        );
    });

    it('calls window.fetch just once', async () => {
        await renderAndWait(<AppointmentsDayViewLoader today={ today } />);
        await renderAndWait(<AppointmentsDayViewLoader today={ today }/>);
        expect(spyOnFetch.mock.calls.length).toBe(1);
    });

});