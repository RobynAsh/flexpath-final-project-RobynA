package org.example.models;

/**
 * Model class for roles.
 */
public class Role {
    /**
     * The username of the user assigned to the role.
     */
    private String username;

    /**
     * The role assigned to the user.
     */
    private String role;

    /**
     * Creates a new role.
     *
     * @param username The username of the user assigned to the role.
     * @param role The role assigned to the user.
     */
    public Role(String username, String role) {
        this.username = username;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
