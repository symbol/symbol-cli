export interface Validator<T> {
    /**
     * Validates a value.
     * Returns true if the value is valid, otherwise returns a message.
     * @param value - Value to be validated.
     * @returns {boolean | string}
     */
    validate(value: T): boolean | string;
}
