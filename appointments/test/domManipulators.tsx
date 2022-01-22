import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { storeSpy } from 'expect-redux';
import { configureStore } from '../src/store';

export const createContainer = () => {
    const container = document.createElement('div');


    const form = (id: string) => container.querySelector<HTMLFormElement>(`form[id="${id}"]`);

    const field = <T extends HTMLFormControlsCollection, >(formId: string, name: Exclude<keyof T, keyof HTMLFormControlsCollection>) => 
        (form(formId)?.elements as T)[name];

    const labelFor = (formElement: string) => container.querySelector<HTMLLabelElement>(`label[for="${formElement}"]`);

    const element = <T extends Element>(selector: string) => container.querySelector<T>(selector);

    const elements = <T extends Element>(selector: string) => 
        Array.from(container.querySelectorAll<T>(selector));

    const simulateEvent = (eventName: keyof typeof ReactTestUtils.Simulate) => 
        (...[element, eventData]: Parameters<typeof ReactTestUtils.Simulate[typeof eventName]>) => 
            ReactTestUtils.Simulate[eventName](element, eventData);

    const simulateEventAndWait = (eventName: keyof typeof ReactTestUtils.Simulate) => async (
        ...[element, eventData]: Parameters<typeof ReactTestUtils.Simulate[typeof eventName]>
    ) =>
        await act(async () =>
            ReactTestUtils.Simulate[eventName](element, eventData)
        );

    const children = (element: Element) => Array.from(element.childNodes);

    return {
        click: simulateEvent('click'),
        clickAndWait: simulateEventAndWait('click'),
        change: simulateEvent('change'),
        changeAndWait: simulateEventAndWait('change'),
        submit: simulateEventAndWait('submit'),
        // eslint-disable-next-line react/no-render-return-value
        render : (component: JSX.Element) => act(() => { ReactDOM.render(component, container); }),
        renderAndWait: async (component: JSX.Element) =>
            // eslint-disable-next-line react/no-render-return-value
            await act(async () => ReactDOM.render(component, container)),
        container,
        form,
        field,
        labelFor,
        element,
        elements,
        children,
        blur: simulateEvent('blur')
    };
};

export type Container = ReturnType<typeof createContainer>;

export const createContainerWithStore = () => {
    const store = configureStore([storeSpy]);

    const container = createContainer();

    return {
        ...container,
        store,
        renderWithStore: (component: JSX.Element) => {
            act(() => {
                ReactDOM.render(
                    <Provider store={ store }>
                        { component }
                    </Provider>,
                    container.container
                );
            });
        }
    };
};

export type ContainerWithStore = ReturnType<typeof createContainerWithStore>;

export const withEvent = <T extends { name: string, value: string }, >(name: string, value: string) => ({
    target: ({ name, value }) as T
});
