import { put, call } from 'redux-saga/effects';
import { fetchQuery, graphql } from 'relay-runtime';

import { getEnvironment } from '../relayEnvironment';
jest.mock('relay-runtime');

export const query = graphql`
    query queryCustomerQuery($id: ID!) {
        customer(id: $id) {
            id
            firstName
            lastName
            phoneNumber
            appointments {
                startsAt
                stylist
                service
                notes
            }
        }
    }
`;

const convertStartsAt = (appointment: { startsAt: number }) => ({
    ...appointment,
    startsAt: Number(appointment.startsAt)
});

export function* queryCustomer({ id }: { id: string, type: string }) {
    try{
        yield put({ type: 'QUERY_CUSTOMER_SUBMITTING' });
        const { customer } = yield call(
            fetchQuery,
            getEnvironment(),
            query,
            { id }
        );
        yield put({
            type: 'QUERY_CUSTOMER_SUCCESSFUL',
            customer,
            appointments: customer.appointments.map(convertStartsAt)
        });
    } catch(e: unknown) {
        yield put({ type: 'QUERY_CUSTOMER_FAILED' });
    }
}

export interface IQueryCustomer {
    customer: {
        id: string,
        firstName: string,
        lastName: string,
        phoneNumber: string
    },
    appointments: {
        startsAt: number,
        stylist: string,
        service: string,
        notes: string
    }[],
    status?: 'SUBMITTING' | 'FAILED' | 'SUCCESSFUL'
} 

const defaultState: IQueryCustomer = {
    customer: {
        id:'',
        firstName:'',
        lastName:'',
        phoneNumber:''
    },
    appointments: [],
    status: undefined
};

export type QueryCustomerRequest = {
    type: 'QUERY_CUSTOMER_REQUEST'
}

export type QueryCustomerSubmitting = {
    type: 'QUERY_CUSTOMER_SUBMITTING',
}

export type QueryCustomerFailed = {
    type: 'QUERY_CUSTOMER_FAILED',
}

export type QueryCustomerSuccessful = {
    type: 'QUERY_CUSTOMER_SUCCESSFUL',
    customer: IQueryCustomer['customer'],
    appointments: IQueryCustomer['appointments']
}

export type QueryCustomerAction = QueryCustomerRequest | QueryCustomerSubmitting | QueryCustomerFailed | QueryCustomerSuccessful;

export const reducer = (state = defaultState, action: QueryCustomerAction) => {
    switch (action.type) {
        case 'QUERY_CUSTOMER_SUBMITTING':
            return { ...state, status: 'SUBMITTING' };
        case 'QUERY_CUSTOMER_FAILED':
            return { ...state, status: 'FAILED' };
        case 'QUERY_CUSTOMER_SUCCESSFUL':
            return {
                ...state,
                customer: action.customer,
                appointments: action.appointments,
                status: 'SUCCESSFUL'
            };
        default:
            return state;
    }
};