import { CustomerAction, CustomerReducer } from '../src/sagas/customer';
export declare const itMaintainsExistingState: (reducer: CustomerReducer, action: CustomerAction) => void;
export declare const itSetsStatus: (reducer: CustomerReducer, action: CustomerAction, value: string) => void;
