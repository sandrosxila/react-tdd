/// <reference types="jest" />
export declare const fetchResponseOk: (body: Awaited<ReturnType<Response['json']>>) => Promise<Response>;
export declare const fetchResponseError: (status?: number, body?: Awaited<ReturnType<Response['json']>>) => Promise<Response>;
export declare const requestBodyOf: (fetchSpy: jest.SpyInstance) => any;
