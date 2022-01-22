import React from 'react';
import { Link } from 'react-router-dom';
import { RouterButton } from '../../src/CustomerSearch/RouterButton';
import { CreatedShallowRenderer, createShallowRenderer } from '../shallowHelpers';

describe('RouterButton', () => {
    const pathname = '/path';
    const queryParams = {
        a: '123',
        b: '234'
    };
    let render: CreatedShallowRenderer['render'];
    let root: CreatedShallowRenderer['root'];

    beforeEach(() => {
        ({ render, root } = createShallowRenderer());
    });

    it('renders a Link', () => {
        render(
            <RouterButton
                pathname={ pathname }
                queryParams={ queryParams }
            />
        );

        expect(root().type).toEqual(Link);
        expect(root().props.className).toContain('button');
        expect(root().props.to).toEqual({
            pathname: '/path',
            search: '?a=123&b=234'
        });
    });

    it('renders a children', () => {
        render(
            <RouterButton
                queryParams={ queryParams }
            >
                child text
            </RouterButton>
        );
        expect(root().props.children).toEqual('child text');
    });

    it('adds disabled class if disabled prop is true', () => {
        render(
            <RouterButton disabled={ true } queryParams={ queryParams } />
        );

        expect(root().props.className).toContain('disabled');
    });
});
