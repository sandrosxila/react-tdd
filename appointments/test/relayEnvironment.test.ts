import 'whatwg-fetch';
import { fetchResponseOk, fetchResponseError } from './spyHelpers';
import { performFetch, getEnvironment } from '../src/relayEnvironment';
import { Network } from 'relay-runtime/lib/network/RelayNetworkTypes';
import * as RelayRuntime from 'relay-runtime';
jest.mock('relay-runtime');

const mockedEnvironment = <jest.Mock<RelayRuntime.Environment>>RelayRuntime.Environment;
const mockedNetwork = <jest.Mock<Network>>RelayRuntime.Network.create;
const mockedStore = <jest.Mock<RelayRuntime.Store>>RelayRuntime.Store;
const mockedRecordSource = <jest.MockedClass<typeof RelayRuntime.RecordSource>>RelayRuntime.RecordSource;

describe('performFetch', () => {
    const response = { data: { id: '123' } };
    const text = 'test';
    const variables = { a:123 };

    let spyOnFetch: jest.SpyInstance;
    
    beforeEach(() => {
        spyOnFetch = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(response));
    });

    it('calls window fetch', () => {
        performFetch({ text } as any, variables);
        expect(spyOnFetch).toHaveBeenCalledWith('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: text,
                variables
            })
        });
    });

    it('returns the request data', async () => {
        const result = await performFetch({ text } as any, variables);
        expect(result).toEqual(response);
    });

    it('rejects when the request fails', async () => {
        spyOnFetch.mockReturnValue(fetchResponseError(500));
        return expect(performFetch({ text } as any, variables),).rejects.toEqual(
            new Error('500')
        );
    });
});

describe('getEnvironment', () => {
    const environment = { a: 123 };
    const network = { b: 234 };
    const store = { c: 345 };
    const recordSource = { d: 456 };
    
    beforeAll(() => {
        mockedEnvironment.mockImplementation(() => environment as any);
        mockedNetwork.mockReturnValue(network as any);
        mockedStore.mockImplementation(() => store as any);
        mockedRecordSource.mockImplementation(() => recordSource as any);

        getEnvironment();
    });

    it('returns environment', () => {
        expect(getEnvironment()).toEqual(environment);
    });

    it('calls Environment with network and store', () => {
        expect(mockedEnvironment).toHaveBeenCalledWith({ network, store });
    });
});
