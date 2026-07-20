package org.example.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Data transfer object for the currently logged in user's profile.
 */
public class ProfileDto {
    /**
     * The user's username.
     */
    private final String username;

    /**
     * Whether the user has the admin role.
     */
    private final boolean isAdmin;

    /**
     * Creates a profile data transfer object.
     *
     * @param username The user's username.
     * @param isAdmin Whether the user has the admin role.
     */
    public ProfileDto(String username, boolean isAdmin) {
        this.username = username;
        this.isAdmin = isAdmin;
    }

    /**
     * Gets the user's username.
     *
     * @return The user's username.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Gets whether the user has the admin role.
     *
     * @return True if the user has the admin role; otherwise, false.
     */
    public boolean getIsAdmin() {
        return isAdmin;
    }
}
