package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Pattern;
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
 * Data access object for patterns.
 */
@Component
public class PatternDao extends JdbcDao {
    /**
     * Creates a new pattern data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public PatternDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all patterns.
     *
     * @return List of Pattern
     */
    public List<Pattern> getPatterns() {
        return jdbcTemplate.query("SELECT * FROM patterns ORDER BY pattern_id;", this::mapToPattern);
    }

    /**
     * Gets all patterns by username.
     *
     * @param username The username that owns the given pattern(s).
     *
     * @return List of Pattern
     */
    public List<Pattern> getPatternsByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM patterns WHERE username = ? ORDER BY pattern_id;", this::mapToPattern, username);
    }

    /**
     * Gets a pattern by id.
     *
     * @param patternId The pattern id.
     *
     * @return Pattern
     */
    public Pattern getPatternById(int patternId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM patterns WHERE pattern_id = ?;", this::mapToPattern, patternId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new pattern.
     *
     * @param pattern The pattern.
     *
     * @return Pattern
     */
    public Pattern createPattern(Pattern pattern) {
        String sql = "INSERT INTO patterns (username, category, technique, name, designer, description, difficulty, link, image_url) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, pattern.getUsername());
            statement.setString(2, pattern.getCategory());
            statement.setString(3, pattern.getTechnique());
            statement.setString(4, pattern.getName());
            statement.setString(5, pattern.getDesigner());
            statement.setString(6, pattern.getDescription());
            statement.setString(7, pattern.getDifficulty());
            statement.setString(8, pattern.getLink());
            statement.setString(9, pattern.getImageUrl());
            return statement;
        }, keyHolder);
        return getPatternById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a pattern.
     *
     * @param pattern The pattern.
     *
     * @return Pattern
     */
    public Pattern updatePattern(Pattern pattern) {
        String sql = "UPDATE patterns SET username = ?, category = ?, technique = ?, name = ?, designer = ?, "
                + "description = ?, difficulty = ?, link = ?, image_url = ? WHERE pattern_id = ?;";
        int rowsAffected = jdbcTemplate.update(
                sql,
                pattern.getUsername(),
                pattern.getCategory(),
                pattern.getTechnique(),
                pattern.getName(),
                pattern.getDesigner(),
                pattern.getDescription(),
                pattern.getDifficulty(),
                pattern.getLink(),
                pattern.getImageUrl(),
                pattern.getPatternId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getPatternById(pattern.getPatternId());
    }

    /**
     * Deletes a pattern.
     *
     * @param patternId The pattern id.
     *
     * @return int The number of rows affected.
     */
    public int deletePattern(int patternId) {
        return jdbcTemplate.update("DELETE FROM patterns WHERE pattern_id = ?;", patternId);
    }

    /**
     * Maps a row in the ResultSet to a Pattern object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Pattern The pattern object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Pattern mapToPattern(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Pattern(
                resultSet.getInt("pattern_id"),
                resultSet.getString("username"),
                resultSet.getString("category"),
                resultSet.getString("technique"),
                resultSet.getString("name"),
                resultSet.getString("designer"),
                resultSet.getString("description"),
                resultSet.getString("difficulty"),
                resultSet.getString("link"),
                resultSet.getString("image_url"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime());
    }
}
