export const required = (description: string) => (value?: string) => 
    !value || value.trim() === '' ? description : undefined;

export const match = (re: RegExp, description: string) => (value?: string) =>
    typeof value === 'string' && !value.match(re) ? description : undefined;

export const list: (...validators: ((value?: string) => string | undefined)[]) => (value?: string) => string | undefined =
(...validators) => (value) => 
    validators.reduce<string | undefined>((result, validator) => result || validator(value), undefined);

export const hasError = (validationErrors: { [key in string]?: string }, fieldName: string) => 
    validationErrors[fieldName] !== undefined;


export const validateMany = (validators: { [key in string]: (value?: string) => string | undefined }, fields: { [key in string]?: string }) => 
    Object.entries(fields).reduce<{ [key in string]?: string }>(
        (result, [name, value]) => ({
            ...result,
            [name]: validators[name](value)
        }), {}
    );
    
export const anyErrors = (errors: ReturnType<typeof validateMany>) => 
    Object.values(errors).some(error => error !== undefined);
