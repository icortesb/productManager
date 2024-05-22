export default class CustomError {
    static createError({ name = "Error", cause, message = "An unknown error has ocurred", code = 1 }) {
        const error = new Error(message);
        error.name = name;
        error.code = code;
        error.cause = cause ? new Error(cause) : null

        throw error;
    }
}