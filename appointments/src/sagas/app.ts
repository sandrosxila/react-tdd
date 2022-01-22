import { AnyAction } from 'redux';
import { put, PutEffect } from 'redux-saga/effects';
import { appHistory } from '../history';

export function* customerAdded({ customer }: { customer: object, type: string }): Generator<PutEffect, void, AnyAction> {
    yield put({ type: 'SET_CUSTOMER_FOR_APPOINTMENT', customer });
    appHistory.push('/addAppointment');
}