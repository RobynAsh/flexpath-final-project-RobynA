package org.example.daos;

import org.example.models.Role;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data access object for roles.
 */
@Component
public class RoleDao extends JdbcDao {
    /**
     * Creates a new role data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public RoleDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all roles.
     *
     * @return List of Role
     */
    public List<Role> getRoles() {
        return jdbcTemplate.query("SELECT * FROM roles ORDER BY username, role;", this::mapToRole);
    }

    /**
     * Gets all roles by username.
     *
     * @param username The username.
     *
     * @return List of Role
     */
    public List<Role> getRolesByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM roles WHERE username = ? ORDER BY role;", this::mapToRole, username);
    }

    /**
     * Gets a role.
     *
     * @param username The username.
     * @param role The role.
     *
     * @return Role
     */
    public Role getRole(String username, String role) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM roles WHERE username = ? AND role = ?;",
                    this::mapToRole,
                    username,
                    role);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new role.
     *
     * @param role The role.
     *
     * @return Role
     */
    public Role createRole(Role role) {
        jdbcTemplate.update(
                "INSERT INTO roles (username, role) VALUES (?, ?);",
                role.getUsername(),
                role.getRole());
        return getRole(role.getUsername(), role.getRole());
    }

    /**
     * Deletes a role.
     *
     * @param username The username.
     * @param role The role.
     *
     * @return int The number of rows affected.
     */
    public int deleteRole(String username, String role) {
        return jdbcTemplate.update("DELETE FROM roles WHERE username = ? AND role = ?;", username, role);
    }

    /**
     * Maps a row in the ResultSet to a Role object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Role The role object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Role mapToRole(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Role(
                resultSet.getString("username"),
                resultSet.getString("role"));
    }
}
