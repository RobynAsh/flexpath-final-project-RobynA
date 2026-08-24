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
import java.util.Map;

/**
 * Data access object for patterns.
 */
@Component
public class PatternDao extends JdbcDao {
    private static final Map<String, String> FILTER_COLUMNS = Map.ofEntries(
            Map.entry("name", "name"),
            Map.entry("username", "username"),
            Map.entry("designer", "designer"),
            Map.entry("category", "category"),
            Map.entry("technique", "technique"),
            Map.entry("difficulty", "difficulty"),
            Map.entry("description", "description"),
            Map.entry("link", "link"),
            Map.entry("imageUrl", "image_url"),
            Map.entry("createdAt", "created_at"),
            Map.entry("updatedAt", "updated_at"));

    private static final Map<String, String> SORT_COLUMNS = Map.of(
            "name", "name",
            "createdAt", "created_at",
            "updatedAt", "updated_at");

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
     * Gets a limited number of patterns by username.
     *
     * @param username The username that owns the given patterns.
     * @param limit The maximum number of patterns to return.
     * @return List of Pattern
     */
    public List<Pattern> getPatternsByUsername(String username, int limit) {
        return jdbcTemplate.query(
                "SELECT * FROM patterns WHERE username = ? ORDER BY pattern_id LIMIT ?;",
                this::mapToPattern,
                username,
                limit);
    }

    /**
     * Gets a user's patterns using database-side filtering and sorting.
     *
     * @param username The pattern owner.
     * @param filterField The API field to filter, or null.
     * @param filterText The case-insensitive text to find, or null.
     * @param sortField The API field to sort.
     * @param sortDirection Either ascending or descending.
     * @param limit The optional maximum number of rows.
     * @return Matching patterns in the requested order.
     */
    public List<Pattern> getPatternsByUsername(
            String username,
            String filterField,
            String filterText,
            String sortField,
            String sortDirection,
            Integer limit) {
        StringBuilder sql = new StringBuilder("SELECT * FROM patterns WHERE username = ?");
        List<Object> parameters = new java.util.ArrayList<>();
        parameters.add(username);

        if (filterText != null && !filterText.isBlank()) {
            String filterColumn = FILTER_COLUMNS.get(filterField);
            sql.append(" AND LOWER(COALESCE(CAST(")
                    .append(filterColumn)
                    .append(" AS CHAR), '')) LIKE LOWER(?) ESCAPE '\\\\'");
            parameters.add("%" + escapeLikeValue(filterText.trim()) + "%");
        }

        sql.append(" ORDER BY ")
                .append(SORT_COLUMNS.get(sortField))
                .append(" ")
                .append("descending".equals(sortDirection) ? "DESC" : "ASC")
                .append(", pattern_id ")
                .append("descending".equals(sortDirection) ? "DESC" : "ASC");

        if (limit != null) {
            sql.append(" LIMIT ?");
            parameters.add(limit);
        }

        sql.append(";");
        return jdbcTemplate.query(sql.toString(), this::mapToPattern, parameters.toArray());
    }

    /**
     * Checks whether a field can be used to filter patterns.
     *
     * @param field The API field name.
     * @return Whether the field is supported.
     */
    public boolean isFilterFieldSupported(String field) {
        return FILTER_COLUMNS.containsKey(field);
    }

    /**
     * Checks whether a field can be used to sort patterns.
     *
     * @param field The API field name.
     * @return Whether the field is supported.
     */
    public boolean isSortFieldSupported(String field) {
        return SORT_COLUMNS.containsKey(field);
    }

    private String escapeLikeValue(String value) {
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
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
                + "description = ?, difficulty = ?, link = ?, image_url = ?, updated_at = ? WHERE pattern_id = ?;";
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
                pattern.getUpdatedAt(),
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
