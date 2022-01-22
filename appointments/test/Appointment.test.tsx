import React from 'react';
import ReactDOM from 'react-dom';
import AppointmentsDayView from '../src/AppointmentsDayView';
import { sampleAppointments as appointments } from '../src/sampleData';

describe('AppointmentsDayView', () => {
    let container: HTMLDivElement;
    // const customer = {};

    beforeEach(() => {
        container = document.createElement('div');
    });

    // eslint-disable-next-line react/no-render-return-value
    const render = (component: JSX.Element) => ReactDOM.render(component, container);

    const appointmentTable = () =>
        container.querySelector('#appointmentView > table');

    it('does not render a table for empty data', () => {
        render(<AppointmentsDayView appointments={ [] } />);
        expect(container.querySelector('div#appointmentsDayView > p')?.textContent)
            .toMatch('There are no appointments scheduled for today.');
    });

    it('renders a table', () => {
        render(<AppointmentsDayView appointments={ appointments } />);
        expect(appointmentTable()).not.toBeNull();
    });

});