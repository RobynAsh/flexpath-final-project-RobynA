package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Tool;
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
 * Data access object for tools.
 */
@Component
public class ToolDao extends JdbcDao {
    /**
     * Creates a new tool data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public ToolDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all tools.
     *
     * @return List of Tool
     */
    public List<Tool> getTools() {
        return jdbcTemplate.query("SELECT * FROM tools ORDER BY tool_id;", this::mapToTool);
    }

    /**
     * Gets a tool by id.
     *
     * @param toolId The tool id.
     *
     * @return Tool
     */
    public Tool getToolById(int toolId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM tools WHERE tool_id = ?;", this::mapToTool, toolId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new tool.
     *
     * @param tool The tool.
     *
     * @return Tool
     */
    public Tool createTool(Tool tool) {
        String sql = "INSERT INTO tools (tool_type, brand, size_mm, material) VALUES (?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, tool.getToolType());
            statement.setString(2, tool.getBrand());
            statement.setFloat(3, tool.getSizeMm());
            statement.setString(4, tool.getMaterial());
            return statement;
        }, keyHolder);
        return getToolById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a tool.
     *
     * @param tool The tool.
     *
     * @return Tool
     */
    public Tool updateTool(Tool tool) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE tools SET tool_type = ?, brand = ?, size_mm = ?, material = ? WHERE tool_id = ?;",
                tool.getToolType(),
                tool.getBrand(),
                tool.getSizeMm(),
                tool.getMaterial(),
                tool.getToolId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getToolById(tool.getToolId());
    }

    /**
     * Deletes a tool.
     *
     * @param toolId The tool id.
     *
     * @return int The number of rows affected.
     */
    public int deleteTool(int toolId) {
        return jdbcTemplate.update("DELETE FROM tools WHERE tool_id = ?;", toolId);
    }

    /**
     * Maps a row in the ResultSet to a Tool object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Tool The tool object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Tool mapToTool(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Tool(
                resultSet.getInt("tool_id"),
                resultSet.getString("tool_type"),
                resultSet.getString("brand"),
                resultSet.getFloat("size_mm"),
                resultSet.getString("material"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime());
    }
}
