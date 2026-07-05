package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.StashYarn;
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
 * Data access object for stash yarns.
 */
@Component
public class StashYarnDao extends JdbcDao {
    /**
     * Creates a new stash yarn data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public StashYarnDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all stash yarns.
     *
     * @return List of StashYarn
     */
    public List<StashYarn> getStashYarns() {
        return jdbcTemplate.query("SELECT * FROM stash_yarns ORDER BY stash_yarn_id;", this::mapToStashYarn);
    }

    /**
     * Gets all stash yarns by username.
     *
     * @param username The username.
     *
     * @return List of StashYarn
     */
    public List<StashYarn> getStashYarnsByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM stash_yarns WHERE username = ? ORDER BY stash_yarn_id;", this::mapToStashYarn, username);
    }

    /**
     * Gets a stash yarn by id.
     *
     * @param stashYarnId The stash yarn id.
     *
     * @return StashYarn
     */
    public StashYarn getStashYarnById(int stashYarnId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM stash_yarns WHERE stash_yarn_id = ?;", this::mapToStashYarn, stashYarnId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new stash yarn.
     *
     * @param stashYarn The stash yarn.
     *
     * @return StashYarn
     */
    public StashYarn createStashYarn(StashYarn stashYarn) {
        String sql = "INSERT INTO stash_yarns (username, yarn_id, dye_lot, is_scrap, scrap_yardage, quantity) VALUES (?, ?, ?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, stashYarn.getUsername());
            statement.setInt(2, stashYarn.getYarnId());
            statement.setString(3, stashYarn.getDyeLot());
            statement.setBoolean(4, stashYarn.isScrap());
            statement.setInt(5, stashYarn.getScrapYardage());
            statement.setInt(6, stashYarn.getQuantity());
            return statement;
        }, keyHolder);
        return getStashYarnById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a stash yarn.
     *
     * @param stashYarn The stash yarn.
     *
     * @return StashYarn
     */
    public StashYarn updateStashYarn(StashYarn stashYarn) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE stash_yarns SET username = ?, yarn_id = ?, dye_lot = ?, is_scrap = ?, scrap_yardage = ?, quantity = ?, removed_at = ? WHERE stash_yarn_id = ?;",
                stashYarn.getUsername(),
                stashYarn.getYarnId(),
                stashYarn.getDyeLot(),
                stashYarn.isScrap(),
                stashYarn.getScrapYardage(),
                stashYarn.getQuantity(),
                stashYarn.getRemovedAt(),
                stashYarn.getStashYarnId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getStashYarnById(stashYarn.getStashYarnId());
    }

    /**
     * Deletes a stash yarn.
     *
     * @param stashYarnId The stash yarn id.
     *
     * @return int The number of rows affected.
     */
    public int deleteStashYarn(int stashYarnId) {
        return jdbcTemplate.update("DELETE FROM stash_yarns WHERE stash_yarn_id = ?;", stashYarnId);
    }

    /**
     * Maps a row in the ResultSet to a StashYarn object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return StashYarn The stash yarn object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private StashYarn mapToStashYarn(ResultSet resultSet, int rowNumber) throws SQLException {
        return new StashYarn(
                resultSet.getInt("stash_yarn_id"),
                resultSet.getString("username"),
                resultSet.getInt("yarn_id"),
                resultSet.getString("dye_lot"),
                resultSet.getBoolean("is_scrap"),
                resultSet.getInt("scrap_yardage"),
                resultSet.getInt("quantity"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime(),
                resultSet.getTimestamp("removed_at") == null ? null : resultSet.getTimestamp("removed_at").toLocalDateTime());
    }
}
