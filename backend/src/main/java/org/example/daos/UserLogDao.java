package org.example.daos;

import org.example.models.UserLog;
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
 * Data access object for user logs.
 */
@Component
public class UserLogDao extends JdbcDao {
    /**
     * Creates a new user log data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public UserLogDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all user logs.
     *
     * @return List of UserLog
     */
    public List<UserLog> getUserLogs() {
        return jdbcTemplate.query("SELECT * FROM user_logs ORDER BY user_log_id;", this::mapToUserLog);
    }

    /**
     * Gets all user logs by username.
     *
     * @param username The username.
     *
     * @return List of UserLog
     */
    public List<UserLog> getUserLogsByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM user_logs WHERE username = ? ORDER BY user_log_id;", this::mapToUserLog, username);
    }

    /**
     * Gets an user log by id.
     *
     * @param userLogId The user log id.
     *
     * @return UserLog
     */
    public UserLog getUserLogById(int userLogId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM user_logs WHERE user_log_id = ?;", this::mapToUserLog, userLogId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new user log.
     *
     * @param userLog The user log.
     *
     * @return UserLog
     */
    public UserLog createUserLog(UserLog userLog) {
        String sql = "INSERT INTO user_logs (username, action, entity_type, entity_id) VALUES (?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, userLog.getUsername());
            statement.setString(2, userLog.getAction());
            statement.setString(3, userLog.getEntityType());
            statement.setObject(4, userLog.getEntityId());
            return statement;
        }, keyHolder);
        return getUserLogById(getGeneratedId(keyHolder));
    }

    /**
     * Deletes an user log.
     *
     * @param userLogId The user log id.
     *
     * @return int The number of rows affected.
     */
    public int deleteUserLog(int userLogId) {
        return jdbcTemplate.update("DELETE FROM user_logs WHERE user_log_id = ?;", userLogId);
    }

    /**
     * Maps a row in the ResultSet to a UserLog object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return UserLog The user log object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private UserLog mapToUserLog(ResultSet resultSet, int rowNumber) throws SQLException {
        return new UserLog(
                resultSet.getInt("user_log_id"),
                resultSet.getString("username"),
                resultSet.getString("action"),
                resultSet.getString("entity_type"),
                resultSet.getInt("entity_id"),
                resultSet.getTimestamp("created_at").toLocalDateTime());
    }
}
