export default class CustomError extends Error {
    constructor({ name = 'Error', message = 'An error has occurred', code = 1 }) {
        super(message);
        this.name = name;
        this.code = code;
    }

    static createError(errorConfig) {
        const error = new CustomError(errorConfig);
        throw error;
    }
}

console.log(CustomError.createError({ name: 'InvalidTypesError', message: 'Invalid types error!', code: 2 }));