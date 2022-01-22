export interface IAppointment {
    customer: {
        id: string,
    }
}

const defaultState: IAppointment = {
    customer: {
        id: '123'
    }
};

type SetCustomerForAppointment = {
    type: 'SET_CUSTOMER_FOR_APPOINTMENT',
    customer: IAppointment['customer']
}

export type AppointmentAction = SetCustomerForAppointment;

export const reducer = (state = defaultState, action: AppointmentAction) => {
    switch (action.type) {
        case 'SET_CUSTOMER_FOR_APPOINTMENT':
            return { ...state, customer: action.customer };
        default:
            return state;
    }
};
  
export type AppointmentReducer = typeof reducer;
