export const fetchResponseOk: (body: Awaited<ReturnType<Response['json']>>) => Promise<Response> = (body) =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(body)
    } as Response);

export const fetchResponseError = (status = 500, body: Awaited<ReturnType<Response['json']>> = {}) =>
    Promise.resolve({
        ok: false,
        status,
        json: () => Promise.resolve(body)
    } as Response);


export const requestBodyOf = (fetchSpy: jest.SpyInstance) =>
    JSON.parse(fetchSpy.mock.calls[0][1].body);
