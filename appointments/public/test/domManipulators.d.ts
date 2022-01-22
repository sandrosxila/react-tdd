import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
export declare const createContainer: () => {
    click: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => void;
    clickAndWait: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => Promise<undefined>;
    change: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => void;
    changeAndWait: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => Promise<undefined>;
    submit: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => Promise<undefined>;
    render: (component: JSX.Element) => void;
    renderAndWait: (component: JSX.Element) => Promise<undefined>;
    container: HTMLDivElement;
    form: (id: string) => HTMLFormElement | null;
    field: <T extends HTMLFormControlsCollection>(formId: string, name: Exclude<keyof T, keyof HTMLFormControlsCollection>) => T[Exclude<keyof T, keyof HTMLFormControlsCollection>];
    labelFor: (formElement: string) => HTMLLabelElement | null;
    element: <T_1 extends Element>(selector: string) => T_1 | null;
    elements: <T_2 extends Element>(selector: string) => T_2[];
    children: (element: Element) => ChildNode[];
    blur: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => void;
};
export declare type Container = ReturnType<typeof createContainer>;
export declare const createContainerWithStore: () => {
    store: import("expect-redux/dist/storeSpy").StoreWithSpy<import("../src/sagas/customer").ICustomer, import("../src/sagas/customer").CustomerAction>;
    renderWithStore: (component: JSX.Element) => void;
    click: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => void;
    clickAndWait: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => Promise<undefined>;
    change: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => void;
    changeAndWait: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => Promise<undefined>;
    submit: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => Promise<undefined>;
    render: (component: JSX.Element) => void;
    renderAndWait: (component: JSX.Element) => Promise<undefined>;
    container: HTMLDivElement;
    form: (id: string) => HTMLFormElement | null;
    field: <T extends HTMLFormControlsCollection>(formId: string, name: Exclude<keyof T, keyof HTMLFormControlsCollection>) => T[Exclude<keyof T, keyof HTMLFormControlsCollection>];
    labelFor: (formElement: string) => HTMLLabelElement | null;
    element: <T_1 extends Element>(selector: string) => T_1 | null;
    elements: <T_2 extends Element>(selector: string) => T_2[];
    children: (element: Element) => ChildNode[];
    blur: (element: Element | React.Component<any, {}, any>, eventData?: ReactTestUtils.SyntheticEventData | undefined) => void;
};
export declare type ContainerWithStore = ReturnType<typeof createContainerWithStore>;
export declare const withEvent: <T extends {
    name: string;
    value: string;
}>(name: string, value: string) => {
    target: T;
};
