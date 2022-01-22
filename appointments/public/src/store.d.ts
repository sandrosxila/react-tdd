import { StoreWithSpy } from 'expect-redux/dist/storeSpy';
import { StoreEnhancer } from 'redux';
import { CustomerAction, ICustomer } from './sagas/customer';
export declare const configureStore: (storeEnhancers?: StoreEnhancer<{}, {}>[]) => StoreWithSpy<ICustomer, CustomerAction>;
