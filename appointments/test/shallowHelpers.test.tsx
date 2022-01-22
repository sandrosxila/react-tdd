import React from 'react';
import { createShallowRenderer, childrenOf, CreatedShallowRenderer, type } from './shallowHelpers';

/* eslint-disable react/jsx-key */

const TestComponent: React.FC = ({ children }) => (
    <React.Fragment>{ children }</React.Fragment>
);

describe('child', () => {
    let render: CreatedShallowRenderer['render'], child: CreatedShallowRenderer['child'];

    beforeEach(() => {
        ({ render, child } = createShallowRenderer()); 
    });

    it('returns undefined if the child does not exist', () => {
        render(<TestComponent />);
        expect(child(0)).not.toBeDefined();
    });

    it('returns child of rendered element', () => {
        render(
            <TestComponent>
                <p>A</p>
                <p>B</p>
            </TestComponent>
        );
        expect(child(1)).toEqual(<p>B</p>);
    });
});


describe('childrenOf', () => {
    it('returns no children', () => {
        expect(childrenOf(<div/>)).toEqual([]);
    });

    it('returns a direct children', () => {
        expect(
            childrenOf(
                <div>
                    <p>A</p>
                    <p>B</p>
                </div>
            )
        ).toEqual([<p>A</p>, <p>B</p>]);
    });

    it('returns text as an array of one item', () => {
        expect(childrenOf(<div>text</div>)).toEqual(['text']);
    });

    it('returns no children for text', () => {
        expect(childrenOf('text')).toEqual([]);
    });

    it('returns array of children for elements with one child', () => {
        expect(
            childrenOf(
                <div>
                    <p>A</p>
                </div>
            )
        ).toEqual([<p>A</p>]);
    });
});

describe('elementsMatching', () => {
    
    let render: CreatedShallowRenderer['render'], elementsMatching: CreatedShallowRenderer['elementsMatching'];
    beforeEach(() => {
        ({ render, elementsMatching } = createShallowRenderer());
    });

    it('finds multiple direct children', () => {
        render(
            <TestComponent>
                <p>A</p>
                <p>B</p>
            </TestComponent>
        );
        expect(elementsMatching(type('p'))).toEqual([<p>A</p>, <p>B</p>]);
    });

    it('finds indirect children', () => {
        render(
            <TestComponent>
                <div>
                    <p>A</p>
                </div>
            </TestComponent>
        );

        expect(elementsMatching(type('p'))).toEqual([<p>A</p>]);
    });
});

describe('elementMatching', () => {
    let render: CreatedShallowRenderer['render'], elementMatching: CreatedShallowRenderer['elementMatching'];
    beforeEach(() => {
        ({ render, elementMatching } = createShallowRenderer());
    });
    
    it('finds indirect children', () => {
        render(
            <TestComponent>
                <div>
                    <p>A</p>
                    <p>B</p>
                </div>
            </TestComponent>
        );

        expect(elementMatching(type('p'))).toEqual(<p>A</p>);
    });
});
