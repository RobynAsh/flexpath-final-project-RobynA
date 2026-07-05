package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.PatternTool;
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
 * Data access object for pattern tools.
 */
@Component
public class PatternToolDao extends JdbcDao {
    /**
     * Creates a new pattern tool data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public PatternToolDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all pattern tools.
     *
     * @return List of PatternTool
     */
    public List<PatternTool> getPatternTools() {
        return jdbcTemplate.query("SELECT * FROM pattern_tools ORDER BY pattern_tool_id;", this::mapToPatternTool);
    }

    /**
     * Gets all pattern tools by pattern id.
     *
     * @param patternId The pattern id for the given tool(s).
     *
     * @return List of PatternTool
     */
    public List<PatternTool> getPatternToolsByPatternId(int patternId) {
        return jdbcTemplate.query("SELECT * FROM pattern_tools WHERE pattern_id = ? ORDER BY pattern_tool_id;", this::mapToPatternTool, patternId);
    }

    /**
     * Gets a pattern tool by id.
     *
     * @param patternToolId The pattern tool id.
     *
     * @return PatternTool
     */
    public PatternTool getPatternToolById(int patternToolId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM pattern_tools WHERE pattern_tool_id = ?;", this::mapToPatternTool, patternToolId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new pattern tool.
     *
     * @param patternTool The pattern tool.
     *
     * @return PatternTool
     */
    public PatternTool createPatternTool(PatternTool patternTool) {
        String sql = "INSERT INTO pattern_tools (pattern_id, tool_type, size_mm) VALUES (?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, patternTool.getPatternId());
            statement.setString(2, patternTool.getToolType());
            statement.setFloat(3, patternTool.getSizeMm());
            return statement;
        }, keyHolder);
        return getPatternToolById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a pattern tool.
     *
     * @param patternTool The pattern tool.
     *
     * @return PatternTool
     */
    public PatternTool updatePatternTool(PatternTool patternTool) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE pattern_tools SET pattern_id = ?, tool_type = ?, size_mm = ? WHERE pattern_tool_id = ?;",
                patternTool.getPatternId(),
                patternTool.getToolType(),
                patternTool.getSizeMm(),
                patternTool.getPatternToolId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getPatternToolById(patternTool.getPatternToolId());
    }

    /**
     * Deletes a pattern tool.
     *
     * @param patternToolId The pattern tool id.
     *
     * @return int The number of rows affected.
     */
    public int deletePatternTool(int patternToolId) {
        return jdbcTemplate.update("DELETE FROM pattern_tools WHERE pattern_tool_id = ?;", patternToolId);
    }

    /**
     * Maps a row in the ResultSet to a PatternTool object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return PatternTool The pattern tool object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private PatternTool mapToPatternTool(ResultSet resultSet, int rowNumber) throws SQLException {
        return new PatternTool(
                resultSet.getInt("pattern_tool_id"),
                resultSet.getInt("pattern_id"),
                resultSet.getString("tool_type"),
                resultSet.getFloat("size_mm"));
    }
}
