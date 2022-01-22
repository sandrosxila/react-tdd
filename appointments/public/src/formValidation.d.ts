export declare const required: (description: string) => (value?: string | undefined) => string | undefined;
export declare const match: (re: RegExp, description: string) => (value?: string | undefined) => string | undefined;
export declare const list: (...validators: ((value?: string) => string | undefined)[]) => (value?: string) => string | undefined;
export declare const hasError: (validationErrors: {
    [x: string]: string | undefined;
}, fieldName: string) => boolean;
export declare const validateMany: (validators: {
    [x: string]: (value?: string | undefined) => string | undefined;
}, fields: {
    [x: string]: string | undefined;
}) => {
    [x: string]: string | undefined;
};
export declare const anyErrors: (errors: ReturnType<typeof validateMany>) => boolean;
