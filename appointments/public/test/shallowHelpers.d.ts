import React from 'react';
export declare const id: (id: string) => (element: JSX.Element) => boolean;
export declare const type: (typeName: JSX.Element['type']) => (element: JSX.Element) => boolean;
export declare const className: (className: string) => (element: JSX.Element) => boolean;
export declare const prop: (pathName: string, value: string) => (element: JSX.Element) => boolean;
export declare const click: (element: JSX.Element) => any;
export declare const childrenOf: (element: JSX.Element | string) => JSX.Element[];
export declare const createShallowRenderer: () => {
    render: (component: React.ReactElement) => void;
    root: () => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    elementsMatching: (matcherFn: (element: JSX.Element) => boolean) => JSX.Element[];
    elementMatching: (matcherFn: (element: JSX.Element) => boolean) => JSX.Element;
    child: (n: number) => JSX.Element;
};
export declare type CreatedShallowRenderer = ReturnType<typeof createShallowRenderer>;
