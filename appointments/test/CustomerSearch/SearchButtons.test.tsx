import React from 'react';
import { CreatedShallowRenderer, createShallowRenderer, id } from '../shallowHelpers';

import { RouterButton } from '../../src/CustomerSearch/RouterButton';
import { SearchButtons } from '../../src/CustomerSearch/SearchButtons';
import ToggleRouterButton from '../../src/CustomerSearch/ToggleRouterButton';

const tenCustomers = Array.from('0123456789',
    id => ({ id, firstName:'', lastName: '', phoneNumber: '' }));

describe('SearchButtons', () => {
    let render: CreatedShallowRenderer['render'];
    let elementMatching: CreatedShallowRenderer['elementMatching'];

    beforeEach(() => {
        ({ render, elementMatching } = createShallowRenderer());
    });

    describe('previous button', () => {
        it('renders', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123'] }
                    searchTerm="term"
                    customers={ tenCustomers }
                />
            );
            const button = elementMatching(id('previous-page'));
            expect(button).toBeDefined();
            expect(button.type).toEqual(RouterButton);
            expect(button.props.children).toEqual('Previous');
            expect(button.props.pathname).toEqual('/path');
            expect(button.props.disabled).toBeFalsy();
        });

        it('removes last appended row ID from lastRowIds in queryParams prop', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123', '234'] }
                    searchTerm="term"
                    customers={ tenCustomers }
                />
            );
            const button = elementMatching(id('previous-page'));
            expect(button.props.queryParams.lastRowIds).toEqual(['123']);
        });

        it('includes limit and search term in queryParams prop', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123'] }
                    searchTerm="name"
                    customers={ tenCustomers }
                    limit={ 20 }
                />
            );
            const button = elementMatching(id('previous-page'));
            expect(button.props.queryParams).toMatchObject({
                limit: 20,
                searchTerm: 'name'
            });
        });

        it('is disabled if there are no lastRowIds', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ [] }
                    searchTerm="term"
                    customers={ tenCustomers }
                />
            );
            const button = elementMatching(id('previous-page'));
            expect(button.props.disabled).toBeTruthy();
        });
    });

    describe('next button', () => {
        it('renders', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123'] }
                    searchTerm="term"
                    customers={ tenCustomers }
                />
            );
            const button = elementMatching(id('next-page'));
            expect(button).toBeDefined();
            expect(button.type).toEqual(RouterButton);
            expect(button.props.children).toEqual('Next');
            expect(button.props.pathname).toEqual('/path');
            expect(button.props.disabled).toBeFalsy();
        });

        it('appends next last row ID to lastRowIds in queryParams prop', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123'] }
                    searchTerm="term"
                    customers={ tenCustomers }
                />
            );
            const button = elementMatching(id('next-page'));
            expect(button.props.queryParams.lastRowIds).toEqual([
                '123',
                '9'
            ]);
        });

        it('includes limit and search term in queryParams prop', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123'] }
                    searchTerm="name"
                    customers={ tenCustomers }
                    limit={ 20 }
                />
            );
            const button = elementMatching(id('next-page'));
            expect(button.props.queryParams).toMatchObject({
                limit: 20,
                searchTerm: 'name'
            });
        });

        it('is disabled if there are fewer records than the page limit shown', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123'] }
                    searchTerm="term"
                    customers={ [] }
                />
            );
            const button = elementMatching(id('next-page'));
            expect(button.props.disabled).toBeTruthy();
        });
    });

    describe('limit toggle buttons', () => {
        it('has a button with a label of 10 that is initially toggled', () => {
            render(
                <SearchButtons
                    pathname="/path"
                    lastRowIds={ ['123'] }
                    searchTerm="term"
                    customers={ tenCustomers }
                />
            );
            const button = elementMatching(id('limit-10'));
            expect(button).toBeDefined();
            expect(button.type).toEqual(ToggleRouterButton);
            expect(button.props.toggled).toEqual(true);
            expect(button.props.children).toEqual('10');
            expect(button.props.pathname).toEqual('/path');
            expect(button.props.queryParams).toEqual({
                limit: 10,
                lastRowIds: ['123'],
                searchTerm: 'term'
            });
        });

        [20, 50, 100].forEach(limitSize => {
            it(`has a button with a label of ${limitSize} that is initially not toggled`, () => {
                render(
                    <SearchButtons
                        pathname="/path"
                        lastRowIds={ ['123'] }
                        searchTerm="term"
                        customers={ tenCustomers }
                    />
                );
                const button = elementMatching(id(`limit-${limitSize}`));
                expect(button).toBeDefined();
                expect(button.type).toEqual(ToggleRouterButton);
                expect(button.props.toggled).toEqual(false);
                expect(button.props.children).toEqual(
                    limitSize.toString()
                );
                expect(button.props.pathname).toEqual('/path');
                expect(button.props.queryParams).toEqual({
                    limit: limitSize,
                    lastRowIds: ['123'],
                    searchTerm: 'term'
                });
            });

            it(`has toggled button with label limit-${limitSize} when limit prop is ${limitSize}`, () => {
                render(
                    <SearchButtons
                        pathname="/path"
                        lastRowIds={ ['123'] }
                        searchTerm="term"
                        customers={ tenCustomers }
                        limit={ limitSize }
                    />
                );
                const button = elementMatching(id(`limit-${limitSize}`));
                expect(button.props.toggled).toEqual(true);
            });
        });
    });
});
