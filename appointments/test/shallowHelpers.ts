import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

export const id = (id: string) =>
    (element: JSX.Element) => 
        !!element.props && element.props?.id === id;

export const type = (typeName: JSX.Element['type']) => 
    (element: JSX.Element) => 
        element.type === typeName;

export const className = (className: string) => 
    (element: JSX.Element) => 
        element.props?.className === className;
        
export const prop = (pathName: string, value: string) => (element: JSX.Element) =>
    element.props[pathName] === value;

export const click = (element: JSX.Element) => element.props.onClick();

export const childrenOf: (element: JSX.Element | string) => JSX.Element[] = (element) => {
    if(typeof element === 'string'){
        return [];
    }
    
    if(!element?.props?.children){
        return [];
    }
    
    const { props: { children } } = element;

    if(typeof children === 'string'){
        return [children];
    }

    if(!Array.isArray(children)){
        return [children];  
    }

    return children;
};

const elementsMatching: (element: JSX.Element, matcherFn: (element: JSX.Element) => boolean) => JSX.Element[]
 = (element, matcherFn) => {
     if(matcherFn(element)){
         return [element];
     }

     return childrenOf(element).reduce<JSX.Element[]>((acc, child) => [
         ...acc,
         ...elementsMatching(child, matcherFn)
     ], []);

 };

export const createShallowRenderer = () => {
    const renderer = ShallowRenderer.createRenderer();
    return {
        render: (component: React.ReactElement) => renderer.render(component, { wrapper: MemoryRouter }),
        root: () => renderer.getRenderOutput(),
        elementsMatching: (matcherFn: (element: JSX.Element) => boolean) => elementsMatching(renderer.getRenderOutput(), matcherFn),
        elementMatching: (matcherFn: (element: JSX.Element) => boolean) => elementsMatching(renderer.getRenderOutput(), matcherFn)[0],
        child: (n: number) => childrenOf(renderer.getRenderOutput())[n],
    };
};

export type CreatedShallowRenderer = ReturnType<typeof createShallowRenderer>;
