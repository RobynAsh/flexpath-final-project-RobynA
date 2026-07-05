package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Yarn;
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
 * Data access object for yarns.
 */
@Component
public class YarnDao extends JdbcDao {
    /**
     * Creates a new yarn data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public YarnDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all yarns.
     *
     * @return List of Yarn
     */
    public List<Yarn> getYarns() {
        return jdbcTemplate.query("SELECT * FROM yarns ORDER BY yarn_id;", this::mapToYarn);
    }

    /**
     * Gets a yarn by id.
     *
     * @param yarnId The yarn id.
     *
     * @return Yarn
     */
    public Yarn getYarnById(int yarnId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM yarns WHERE yarn_id = ?;", this::mapToYarn, yarnId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new yarn.
     *
     * @param yarn The yarn.
     *
     * @return Yarn
     */
    public Yarn createYarn(Yarn yarn) {
        String sql = "INSERT INTO yarns (brand, colorway, color, weight, fiber, style, yardage, grams, image_url) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, yarn.getBrand());
            statement.setString(2, yarn.getColorway());
            statement.setString(3, yarn.getColor());
            statement.setString(4, yarn.getWeight());
            statement.setString(5, yarn.getFiber());
            statement.setString(6, yarn.getStyle());
            statement.setInt(7, yarn.getYardage());
            statement.setFloat(8, yarn.getGrams());
            statement.setString(9, yarn.getImageUrl());
            return statement;
        }, keyHolder);
        return getYarnById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a yarn.
     *
     * @param yarn The yarn.
     *
     * @return Yarn
     */
    public Yarn updateYarn(Yarn yarn) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE yarns SET brand = ?, colorway = ?, color = ?, weight = ?, fiber = ?, style = ?, yardage = ?, grams = ?, image_url = ? WHERE yarn_id = ?;",
                yarn.getBrand(),
                yarn.getColorway(),
                yarn.getColor(),
                yarn.getWeight(),
                yarn.getFiber(),
                yarn.getStyle(),
                yarn.getYardage(),
                yarn.getGrams(),
                yarn.getImageUrl(),
                yarn.getYarnId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getYarnById(yarn.getYarnId());
    }

    /**
     * Deletes a yarn.
     *
     * @param yarnId The yarn id.
     *
     * @return int The number of rows affected.
     */
    public int deleteYarn(int yarnId) {
        return jdbcTemplate.update("DELETE FROM yarns WHERE yarn_id = ?;", yarnId);
    }

    /**
     * Maps a row in the ResultSet to a Yarn object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Yarn The yarn object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Yarn mapToYarn(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Yarn(
                resultSet.getInt("yarn_id"),
                resultSet.getString("brand"),
                resultSet.getString("colorway"),
                resultSet.getString("color"),
                resultSet.getString("weight"),
                resultSet.getString("fiber"),
                resultSet.getString("style"),
                resultSet.getInt("yardage"),
                resultSet.getFloat("grams"),
                resultSet.getString("image_url"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime());
    }
}
