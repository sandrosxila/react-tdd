import React from 'react';
import {
    createShallowRenderer,
    type,
    childrenOf,
    className,
    prop,
    CreatedShallowRenderer,
    click
} from './shallowHelpers';
import { Link, Routes } from 'react-router-dom';
import App, { MainScreen } from '../src/App';
import { AppointmentFormLoader } from '../src/AppointmentFormLoader';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import CustomerForm from '../src/CustomerForm';
import { CustomerSearch } from '../src/CustomerSearch/CustomerSearch';
import { CustomerHistory } from '../src/CustomerHistory';
jest.mock('relay-runtime');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

const mockedUsedDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockedUsedDispatch,
}));

describe('MainScreen', () => {

    let render: CreatedShallowRenderer['render'];
    let elementMatching: CreatedShallowRenderer['elementMatching'];
    let child: CreatedShallowRenderer['child'];
  
    beforeEach(() => {
        ({ render, child, elementMatching } = createShallowRenderer());
    });

    it('renders a button bar as the first child', () => {
        render(<MainScreen />);
        expect(child(0).type).toEqual('div');
        expect(child(0).props.className).toEqual('button-bar');
    });

    it('renders an AppointmentsDayViewLoader', () => {
        render(<MainScreen />);
        expect(
            elementMatching(type(AppointmentsDayViewLoader))
        ).toBeDefined();
    });

    it('renders a Link to /addCustomer', () => {
        render(<MainScreen />);
        const links = childrenOf(
            elementMatching(className('button-bar'))
        );
        expect(links[0].type).toEqual(Link);
        expect(links[0].props.to).toEqual('/addCustomer');
        expect(links[0].props.className).toEqual('button');
        expect(links[0].props.children).toEqual(
            'Add customer and appointment'
        );
    });

    it('renders a Link to /searchCustomers', () => {
        render(<MainScreen />);
        const links = childrenOf(
            elementMatching(className('button-bar'))
        );
        expect(links[1].type).toEqual(Link);
        expect(links[1].props.to).toEqual('/searchCustomers');
        expect(links[1].props.className).toEqual('button');
        expect(links[1].props.children).toEqual('Search customers');
    });
});


describe('App', () => {
    let render: CreatedShallowRenderer['render'];
    let elementMatching: CreatedShallowRenderer['elementMatching'];

    beforeEach(() => {
        ({
            render,
            elementMatching,
        } = createShallowRenderer());

        
    });

    const childRoutes = () =>
        childrenOf(elementMatching(type(Routes)));

    const routeFor = (path: string) => childRoutes().find(prop('path', path))!;

    it('renders the MainScreen as the default route', () => {
        render(<App />);
        const routes = childRoutes();
        const lastRoute = routes[routes.length - 1];
        expect(lastRoute.props.element).toEqual(<MainScreen/>);
    });

    it('renders CustomerForm at the /addCustomer endpoint', () => {
        render(<App />);
        expect(routeFor('/addCustomer').props.element.type).toEqual(
            CustomerForm
        );
    });

    it('renders AppointmentFormLoader at /addAppointment', () => {
        render(<App />);
        expect(
            routeFor('/addAppointment').props.element.type
        ).toEqual(AppointmentFormLoader);
    });

    it('renders CustomerSearch at /searchCustomers', () => {
        render(<App />);
        expect(
            routeFor('/searchCustomers').props.element.type
        ).toEqual(CustomerSearch);
    });

    const customer = { id: '123' };
    
    it('navigates to / when AppointmentFormLoader is saved', () => {
        render(<App/>);
        const onSave = routeFor('/addAppointment').props.element.props
            .onSave;
        onSave();
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });

    describe('search customers', () => {

        const renderSearchActionsForCustomer = (customer: { id: string }) => {
            render(<App />);
            const customerSearch = routeFor(
                '/searchCustomers'
            ).props.element;
            const searchActionsComponent =
            customerSearch.props.renderCustomerActions;
            return searchActionsComponent(customer);
        };
    
        it('passes a button to the CustomerSearch named Create appointment', () => {
            const button = childrenOf(
                renderSearchActionsForCustomer(customer)
            )[0];
            expect(button).toBeDefined();
            expect(button.type).toEqual('button');
            expect(button.props.role).toEqual('button');
            expect(button.props.children).toEqual('Create appointment');
        });


        it('navigates to /addAppointment when clicking the Create appointment button', () => {
            const button = childrenOf(
                renderSearchActionsForCustomer(customer)
            )[0];
            click(button);
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/addAppointment');
        });
    
        it('passes saved customer to AppointmentFormLoader when clicking the Create appointment button', () => {
            const button = childrenOf(
                renderSearchActionsForCustomer(customer)
            )[0];
            click(button);
            expect(mockedUsedDispatch).toHaveBeenCalledWith({ type: 'SET_CUSTOMER_FOR_APPOINTMENT', customer });
        });

        it('passes a button to the CustomerSearch named View history', async () => {
            const button = childrenOf(
                renderSearchActionsForCustomer(customer)
            )[1];
            expect(button.type).toEqual('button');
            expect(button.props.role).toEqual('button');
            expect(button.props.children).toEqual('View history');
        });


        it('navigates to /customer/:id when clicking the View history button', async () => {
            const button = childrenOf(
                renderSearchActionsForCustomer(customer)
            )[1];
            click(button);
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/customer/123');
        });

        it('renders CustomerHistory at /customer', async () => {
            render(<App />);
            const element = routeFor('/customer/:id').props.element;
            expect(element).toEqual(<CustomerHistory id='123'/>);
            expect(element.props.id).toEqual('123');
        });

    });
});