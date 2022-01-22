import {
    Environment,
    Network,
    RecordSource,
    RequestParameters,
    Store,
    Variables
} from 'relay-runtime';

const verifyStatusOk = (result: Response) => {
    if (!result.ok) {
        return Promise.reject(new Error('500'));
    } else {
        return result;
    }
};

export const performFetch = (operation: RequestParameters, variables: Variables) => 
    window.fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    }).then(verifyStatusOk).then(result => result.json());


let environment: Environment | null = null;
export const getEnvironment = () =>{
    if(environment === null)
        environment = new Environment({
            network: Network.create(performFetch),
            store: new Store(new RecordSource())
        });

    return environment;
};
