package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.StashTool;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

/**
 * Data access object for stash tools.
 */
@Component
public class StashToolDao extends JdbcDao {
    /**
     * Creates a new stash tool data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public StashToolDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all stash tools.
     *
     * @return List of StashTool
     */
    public List<StashTool> getStashTools() {
        return jdbcTemplate.query("SELECT * FROM stash_tools ORDER BY stash_tool_id;", this::mapToStashTool);
    }

    /**
     * Gets all stash tools by username.
     *
     * @param username The username.
     *
     * @return List of StashTool
     */
    public List<StashTool> getStashToolsByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM stash_tools WHERE username = ? ORDER BY stash_tool_id;", this::mapToStashTool, username);
    }

    /**
     * Gets a stash tool by id.
     *
     * @param stashToolId The stash tool id.
     *
     * @return StashTool
     */
    public StashTool getStashToolById(int stashToolId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM stash_tools WHERE stash_tool_id = ?;", this::mapToStashTool, stashToolId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new stash tool.
     *
     * @param stashTool The stash tool.
     *
     * @return StashTool
     */
    public StashTool createStashTool(StashTool stashTool) {
        String sql = "INSERT INTO stash_tools (username, tool_id, quantity) VALUES (?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, stashTool.getUsername());
            statement.setInt(2, stashTool.getToolId());
            statement.setInt(3, stashTool.getQuantity());
            return statement;
        }, keyHolder);
        return getStashToolById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a stash tool.
     *
     * @param stashTool The stash tool.
     *
     * @return StashTool
     */
    public StashTool updateStashTool(StashTool stashTool) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE stash_tools SET username = ?, tool_id = ?, quantity = ?, removed_at = ? WHERE stash_tool_id = ?;",
                stashTool.getUsername(),
                stashTool.getToolId(),
                stashTool.getQuantity(),
                stashTool.getRemovedAt(),
                stashTool.getStashToolId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getStashToolById(stashTool.getStashToolId());
    }

    /**
     * Deletes a stash tool.
     *
     * @param stashToolId The stash tool id.
     *
     * @return int The number of rows affected.
     */
    public int deleteStashTool(int stashToolId) {
        return jdbcTemplate.update("DELETE FROM stash_tools WHERE stash_tool_id = ?;", stashToolId);
    }

    /**
     * Maps a row in the ResultSet to a StashTool object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return StashTool The stash tool object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private StashTool mapToStashTool(ResultSet resultSet, int rowNumber) throws SQLException {
        return new StashTool(
                resultSet.getInt("stash_tool_id"),
                resultSet.getString("username"),
                resultSet.getInt("tool_id"),
                resultSet.getInt("quantity"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime(),
                resultSet.getTimestamp("removed_at") == null ? null : resultSet.getTimestamp("removed_at").toLocalDateTime());
    }
}
