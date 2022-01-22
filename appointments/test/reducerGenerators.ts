import { AnyAction, Reducer } from 'redux';

// eslint-disable-next-line jest/no-export
export const itMaintainsExistingState = <R extends Reducer, A extends AnyAction>(reducer: R, action: A) => {
    it('maintains existing state', () => {
        const existing = { a: 123 };
        expect(reducer(existing, action)).toMatchObject(existing);
    });
};



// eslint-disable-next-line jest/no-export
export const itSetsStatus = <R extends Reducer, A extends AnyAction>(reducer: R, action: A, value: string) => {
    it(`sets status to ${value}`, () => {
        expect(reducer(undefined, action)).toMatchObject({
            status: value
        });
    });
};

