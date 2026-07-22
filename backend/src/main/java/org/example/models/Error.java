package org.example.models;

/**
 * Model class for error responses.
 */
public class Error {
    /**
     * The error message.
     */
    private String message;

    /**
     * Creates an empty error response.
     */
    public Error() {
    }

    /**
     * Creates a new error response.
     *
     * @param message The error message.
     */
    public Error(String message) {
        this.message = message;
    }

    /**
     * Gets the error message.
     *
     * @return The error message.
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the error message.
     *
     * @param message The error message.
     */
    public void setMessage(String message) {
        this.message = message;
    }
}
