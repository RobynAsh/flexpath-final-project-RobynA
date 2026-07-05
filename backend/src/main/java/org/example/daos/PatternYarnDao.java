package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.PatternYarn;
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
 * Data access object for pattern yarns.
 */
@Component
public class PatternYarnDao extends JdbcDao {
    /**
     * Creates a new pattern yarn data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public PatternYarnDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all pattern yarns.
     *
     * @return List of PatternYarn
     */
    public List<PatternYarn> getPatternYarns() {
        return jdbcTemplate.query("SELECT * FROM pattern_yarns ORDER BY pattern_yarn_id;", this::mapToPatternYarn);
    }

    /**
     * Gets all pattern yarns by pattern id.
     *
     * @param patternId The pattern id for the given yarn.
     *
     * @return List of PatternYarn
     */
    public List<PatternYarn> getPatternYarnsByPatternId(int patternId) {
        return jdbcTemplate.query("SELECT * FROM pattern_yarns WHERE pattern_id = ? ORDER BY pattern_yarn_id;", this::mapToPatternYarn, patternId);
    }

    /**
     * Gets a pattern yarn by id.
     *
     * @param patternYarnId The pattern yarn id.
     *
     * @return PatternYarn
     */
    public PatternYarn getPatternYarnById(int patternYarnId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM pattern_yarns WHERE pattern_yarn_id = ?;", this::mapToPatternYarn, patternYarnId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new pattern yarn.
     *
     * @param patternYarn The pattern yarn.
     *
     * @return PatternYarn
     */
    public PatternYarn createPatternYarn(PatternYarn patternYarn) {
        String sql = "INSERT INTO pattern_yarns (pattern_id, suggested_yarn_id, description, weight, yardage, grams) VALUES (?, ?, ?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, patternYarn.getPatternId());
            statement.setObject(2, patternYarn.getSuggestedYarnId());
            statement.setString(3, patternYarn.getDescription());
            statement.setInt(4, patternYarn.getWeight());
            statement.setInt(5, patternYarn.getYardage());
            statement.setFloat(6, patternYarn.getGrams());
            return statement;
        }, keyHolder);
        return getPatternYarnById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a pattern yarn.
     *
     * @param patternYarn The pattern yarn.
     *
     * @return PatternYarn
     */
    public PatternYarn updatePatternYarn(PatternYarn patternYarn) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE pattern_yarns SET pattern_id = ?, suggested_yarn_id = ?, description = ?, weight = ?, yardage = ?, grams = ? WHERE pattern_yarn_id = ?;",
                patternYarn.getPatternId(),
                patternYarn.getSuggestedYarnId(),
                patternYarn.getDescription(),
                patternYarn.getWeight(),
                patternYarn.getYardage(),
                patternYarn.getGrams(),
                patternYarn.getPatternYarnId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getPatternYarnById(patternYarn.getPatternYarnId());
    }

    /**
     * Deletes a pattern yarn.
     *
     * @param patternYarnId The pattern yarn id.
     *
     * @return int The number of rows affected.
     */
    public int deletePatternYarn(int patternYarnId) {
        return jdbcTemplate.update("DELETE FROM pattern_yarns WHERE pattern_yarn_id = ?;", patternYarnId);
    }

    /**
     * Maps a row in the ResultSet to a PatternYarn object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return PatternYarn The pattern yarn object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private PatternYarn mapToPatternYarn(ResultSet resultSet, int rowNumber) throws SQLException {
        return new PatternYarn(
                resultSet.getInt("pattern_yarn_id"),
                resultSet.getInt("pattern_id"),
                resultSet.getInt("suggested_yarn_id"),
                resultSet.getString("description"),
                resultSet.getInt("weight"),
                resultSet.getInt("yardage"),
                resultSet.getFloat("grams"));
    }
}
