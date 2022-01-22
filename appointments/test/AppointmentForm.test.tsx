import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { ContainerWithStore, createContainerWithStore, withEvent } from './domManipulators';
import AppointmentForm from '../src/AppointmentForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from './spyHelpers';
import 'whatwg-fetch';
jest.mock('relay-runtime');

describe('AppointmentForm', () => {

    let renderWithStore: ContainerWithStore['renderWithStore'];
    let container: ContainerWithStore['container'];
    let form: ContainerWithStore['form'];
    let field: ContainerWithStore['field'];
    let labelFor: ContainerWithStore['labelFor'];
    let element: ContainerWithStore['element'];
    let change: ContainerWithStore['change'];
    let children: ContainerWithStore['children'];
    let submit: ContainerWithStore['submit'];
    
    let spyOnFetch: jest.SpyInstance<Promise<Response>, [input: RequestInfo, init?: RequestInit | undefined]>;

    beforeEach(() => {
        ({ renderWithStore, container, form, field, labelFor, element, change, children, submit } = createContainerWithStore());
        spyOnFetch = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk({}));
    });

    afterEach(() => {
        spyOnFetch.mockReset();
        spyOnFetch.mockRestore();
    });

    interface FormElements extends HTMLFormControlsCollection {
        service: HTMLSelectElement,
        stylist: HTMLSelectElement,
    }

    type FormFields = Omit<FormElements, keyof HTMLFormControlsCollection>;
    type FieldName = Exclude<keyof FormFields, keyof HTMLFormControlsCollection>;

    const findOption = (dropdownNode: HTMLSelectElement, textContent: string) => {
        const options = Array.from(dropdownNode.options);
        return options.find(
            option => option.textContent === textContent
        );
    };

    const startsAtField = (index: number) => container.querySelectorAll<HTMLInputElement>('input[name="startsAt"]')[index];

    it('renders a form', () => {
        renderWithStore(<AppointmentForm selectableServices={ [] } service={ '' } />);
        expect(form('appointment')).not.toBeNull();
    });


    it('has a submit button', () => {
        renderWithStore(<AppointmentForm />);
        const submitButton = element('input[type="submit"]');
        expect(submitButton).not.toBeNull();
    });

    it('calls fetch with the right properties when submitting data', async () => {
        const customer = { id: '123' };
        renderWithStore(<AppointmentForm customer={ customer }/>);
        await submit(form('appointment')!);
        expect(spyOnFetch).toHaveBeenCalledWith(
            '/appointments',
            expect.objectContaining({
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            })
        );
    }); 

    it('notifies onSave when form is submitted', async () => {
        const customer = { id: '123' };
        spyOnFetch.mockReturnValue(fetchResponseOk({}));
        const saveSpy = jest.fn();
    
        renderWithStore(<AppointmentForm onSave={ saveSpy } customer={ customer } />);
        await submit(form('appointment')!);
    
        expect(saveSpy).toHaveBeenCalled();
    });

    it('does not notify onSave if the POST request returns an error', async () => {
        spyOnFetch.mockReturnValue(fetchResponseError());
        const saveSpy = jest.fn();
        const customer = { id: '123' };
        renderWithStore(<AppointmentForm onSave={ saveSpy } customer={ customer }/>);
        await submit(form('appointment')!);
    
        expect(saveSpy).not.toHaveBeenCalled();
    });
    
    it('prevents the default action when submitting the form', async () => {
        const preventDefaultSpy = jest.fn();
        const customer = { id: '123' };
        renderWithStore(<AppointmentForm customer={ customer }/>);
        await submit(form('appointment')!, {
            preventDefault: preventDefaultSpy
        });
    
        expect(preventDefaultSpy).toHaveBeenCalled();
    });
    
    it('renders error message when fetch call fails', async () => {
        spyOnFetch.mockReturnValue(fetchResponseError());
        const customer = { id: '123' };
        renderWithStore(<AppointmentForm customer={ customer }/>);
        await submit(form('appointment')!);
    
        expect(element('.error')).not.toBeNull();
        expect(element('.error')!.textContent).toMatch(
            'error occurred'
        );
    });

    it('clears error message when fetch call succeeds', async () => {
        const customer = { id: '123' };
        spyOnFetch.mockReturnValueOnce(fetchResponseError());
        spyOnFetch.mockReturnValue(fetchResponseOk({}));
    
        renderWithStore(<AppointmentForm customer={ customer }/>);
        await submit(form('appointment')!);
        await submit(form('appointment')!);
    
        expect(element('.error')).toBeNull();
    });
    
    it('passes the customer id to fetch when submitting', async () => {
        const customer = { id: '123' };
        renderWithStore(<AppointmentForm customer={ customer } />);
        await submit(form('appointment')!);
        expect(requestBodyOf(spyOnFetch)).toMatchObject({
            customer: customer.id
        });
    });

    const itRendersAsASelectBox = (fieldName: FieldName) => {
        it('renders as a select box', () => {
            renderWithStore(<AppointmentForm />);
            expect(field<FormElements>('appointment', fieldName)).not.toBeNull();
            expect(field<FormElements>('appointment', fieldName).tagName).toEqual(
                'SELECT'
            );
        });
    };

    const itInitiallyHasABlankValueChosen = (fieldName: FieldName) =>
        it('initially has a blank value chosen', () => {
            renderWithStore(
                <AppointmentForm />
            );
            const firstNode = field<FormElements>('appointment', fieldName).options[0];
            expect(firstNode.value).toEqual('');
            expect(firstNode.selected).toBeTruthy();
        });

    const itPreselectsExistingValue = (
        fieldName: FieldName,
        props: Parameters<typeof AppointmentForm>[0],
        existingValue: string
    ) => {
        it('pre-selects the existing value', () => {
            renderWithStore(
                <AppointmentForm
                    { ...props }
                    { ...{ [fieldName]: existingValue } }
                />
            );
            const option = findOption(
                field<FormElements>('appointment', fieldName),
                existingValue
            );
            expect(option!.selected).toBeTruthy();
        });
    };

    const itRendersALabel = (fieldName: FieldName, text: string) => {
        it('renders a label', () => {
            renderWithStore(<AppointmentForm />);
            expect(labelFor(fieldName)).not.toBeNull();
            expect(labelFor(fieldName)!.textContent).toEqual(text);
        });
    };

    const itAssignsAnIdThatMatchesTheLabelId = (fieldName: FieldName) => {
        it('assigns an id that matches the label id', () => {
            renderWithStore(<AppointmentForm />);
            expect(field<FormElements>('appointment', fieldName).id).toEqual(
                fieldName
            );
        });
    };

    const itSubmitsExistingValue = (fieldName: FieldName, props: Parameters<typeof AppointmentForm>[0]) => {
        it('saves existing value when submitted', async () => {
            renderWithStore(
            
                <AppointmentForm
                    { ...props }
                    { ...{ [fieldName]: 'value' } }
                />
                
            );
            await submit(form('appointment')!);
                
            expect(requestBodyOf(spyOnFetch)).toMatchObject({
                [fieldName]: 'value'
            });
        });
    };

    const itSubmitsNewValue = (fieldName: FieldName, props: Parameters<typeof AppointmentForm>[0]) => {
        it('saves new value when submitted', async () => {
            renderWithStore(
                <AppointmentForm
                    { ...props }
                    { ...{ [fieldName]: 'existingValue' } }
                />
            );
            change(
                field<FormElements>('appointment', fieldName),
                withEvent<FormElements[FieldName]>(fieldName, 'newValue')
            );
            await submit(form('appointment')!);

            expect(requestBodyOf(spyOnFetch)).toMatchObject({
                [fieldName]: 'newValue'
            });
        });
    };

    describe('service field', () => {
        itRendersAsASelectBox('service');
        itInitiallyHasABlankValueChosen('service');
        itPreselectsExistingValue(
            'service',
            { selectableServices: ['Cut', 'Blow-dry'] },
            'Blow-dry'
        );
        itRendersALabel('service', 'Salon service');
        itAssignsAnIdThatMatchesTheLabelId('service');
        itSubmitsExistingValue('service', {
            serviceStylists: { value: [] },
            customer: { id:'123' }
        });
        itSubmitsNewValue('service', {
            serviceStylists: { newValue: [], existingValue: [] }, 
            customer: { id:'123' }
        });
    
        it('lists all salon services', () => {
            const selectableServices = ['Cut', 'Blow-dry'];
    
            renderWithStore(<AppointmentForm selectableServices={ selectableServices } />);
    
            const renderedServices = children(
                field<FormElements>('appointment', 'service')
            ).map(node => node.textContent);
            expect(renderedServices).toEqual(
                expect.arrayContaining(selectableServices)
            );
        });
    });


    describe('stylist field', () => {
        itRendersAsASelectBox('stylist');
        itInitiallyHasABlankValueChosen('stylist');
        itPreselectsExistingValue(
            'stylist',
            { selectableStylists: ['Ashley', 'Jo'], customer: { id: '123' } },
            'Ashley'
        );
        itRendersALabel('stylist', 'Stylist');
        itAssignsAnIdThatMatchesTheLabelId('stylist');
        itSubmitsExistingValue('stylist', { customer: { id: '123' } });
        itSubmitsNewValue('stylist', { customer: { id: '123' } });
    
        it('lists only stylists that can perform the selected service', () => {
            const selectableServices = ['1', '2'];
            const selectableStylists = ['A', 'B', 'C'];
            const serviceStylists = {
                '1': ['A', 'B']
            };
    
            renderWithStore(
                <AppointmentForm
                    selectableServices={ selectableServices }
                    selectableStylists={ selectableStylists }
                    serviceStylists={ serviceStylists }
                />
            );
    
            change(
                field<FormElements>('appointment', 'service'),
                withEvent<FormElements['service']>('service', '1')
            );
    
            const renderedServices = children(
                field<FormElements>('appointment', 'stylist')
            ).map(node => node.textContent);
            expect(renderedServices).toEqual(
                expect.arrayContaining(['A', 'B'])
            );
        });
    });

    const timeSlotTable = () => container.querySelector('table#time-slots');

    describe('time slot table', () => {

        it('renders a table for time slots', () => {
            renderWithStore(<AppointmentForm selectableServices={ [] } service={ '' } />);
            expect(
                container.querySelector('table#time-slots')
            ).not.toBeNull();
        });

        it('renders a time slot for every half an hour between open and close times', () => {
            renderWithStore(<AppointmentForm salonOpensAt={ 9 } salonClosesAt={ 11 } />);

            const timesOfDay = timeSlotTable()?.querySelectorAll('tbody >* th');

            expect(timesOfDay).toHaveLength(4);
            expect(timesOfDay![0].textContent).toEqual('09:00');
            expect(timesOfDay![1].textContent).toEqual('09:30');
            expect(timesOfDay![3].textContent).toEqual('10:30');
        });

        it('renders an empty cell at the start of the header row', () => {
            renderWithStore(<AppointmentForm />);
            const headerRow = timeSlotTable()?.querySelector('thead > tr');
            expect(headerRow?.firstChild?.textContent).toEqual('');
        });

        it('renders a week of available dates', () => {
            const today = new Date(2018, 11, 1);
            renderWithStore(<AppointmentForm today={ today } />);
            const dates = timeSlotTable()?.querySelectorAll('thead >* th:not(:first-child)');
            expect(dates).toHaveLength(7);
            expect(dates![0].textContent).toBe('Sat 01');
            expect(dates![1].textContent).toBe('Sun 02');
            expect(dates![6].textContent).toBe('Fri 07');
        });

        it('renders a radio button for each time slot', () => {
            const today = new Date();
            const availableTimeSlots = [
                { startsAt: today.setHours(9, 0, 0, 0), stylists: [] },
                { startsAt: today.setHours(9, 30, 0, 0), stylists: [] },
            ];

            renderWithStore(
                <AppointmentForm
                    availableTimeSlots={ availableTimeSlots }
                    today={ today }
                />
            );

            const cells = timeSlotTable()?.querySelectorAll('td');
            expect(
                cells![0].querySelector('input[type="radio"]')
            ).not.toBeNull();
            expect(
                cells![7].querySelector('input[type="radio"]')
            ).not.toBeNull();
        });

        it('does not render radio buttons for unavailable time slots', () => {
            renderWithStore(<AppointmentForm availableTimeSlots={ [] } />);
            const timesOfDay = timeSlotTable()?.querySelectorAll(
                'input'
            );
            expect(timesOfDay).toHaveLength(0);
        });

        it('sets radio button values to the index of the corresponding appointment', () => {
            const today = new Date();
            const availableTimeSlots = [
                { startsAt: today.setHours(9, 0, 0, 0), stylists: [] },
                { startsAt: today.setHours(9, 30, 0, 0), stylists:[] },
            ];
            renderWithStore(<AppointmentForm availableTimeSlots={ availableTimeSlots } today={ today } />);
            expect(startsAtField(0).value).toEqual(
                availableTimeSlots[0].startsAt.toString()
            );
            expect(startsAtField(1).value).toEqual(
                availableTimeSlots[1].startsAt.toString()
            );
        });

        it('saves new value when submitted', async () => {
            const today = new Date();
            const availableTimeSlots = [
                { startsAt: today.setHours(9, 0, 0, 0), stylists: [] },
                { startsAt: today.setHours(9, 30, 0, 0), stylists: [] },
            ];
            const customer = { id: '123' };
            renderWithStore(
                <AppointmentForm 
                    availableTimeSlots={ availableTimeSlots } 
                    today={ today } 
                    startsAt={ availableTimeSlots[0].startsAt }
                    onSubmit={ 
                        ({ startsAt }) => 
                            expect(startsAt).toEqual(
                                availableTimeSlots[1].startsAt
                            ) 
                    }
                    customer={ customer }
                />
            );

            ReactTestUtils.Simulate.change(startsAtField(1), {
                target: {
                    value: availableTimeSlots[1].startsAt.toString(),
                    name: 'startsAt'
                }
            } as object);
            
            await act(async () => {
                ReactTestUtils.Simulate.submit(form('appointment')!);
            });
            
        });
    });
    

});
