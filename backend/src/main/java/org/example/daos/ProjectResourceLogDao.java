package org.example.daos;

import org.example.models.ProjectResourceLog;
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
 * Data access object for project resource logs.
 */
@Component
public class ProjectResourceLogDao extends JdbcDao {
    /**
     * Creates a new project resource log data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public ProjectResourceLogDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all project resource logs.
     *
     * @return List of ProjectResourceLog
     */
    public List<ProjectResourceLog> getProjectResourceLogs() {
        return jdbcTemplate.query("SELECT * FROM project_resource_logs ORDER BY log_id;", this::mapToProjectResourceLog);
    }

    /**
     * Gets all project resource logs by project id.
     *
     * @param projectId The project id.
     *
     * @return List of ProjectResourceLog
     */
    public List<ProjectResourceLog> getProjectResourceLogsByProjectId(int projectId) {
        return jdbcTemplate.query("SELECT * FROM project_resource_logs WHERE project_id = ? ORDER BY log_id;", this::mapToProjectResourceLog, projectId);
    }

    /**
     * Gets a project resource log by id.
     *
     * @param logId The log id.
     *
     * @return ProjectResourceLog
     */
    public ProjectResourceLog getProjectResourceLogById(int logId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM project_resource_logs WHERE log_id = ?;", this::mapToProjectResourceLog, logId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new project resource log.
     *
     * @param log The log.
     *
     * @return ProjectResourceLog
     */
    public ProjectResourceLog createProjectResourceLog(ProjectResourceLog log) {
        String sql = "INSERT INTO project_resource_logs (project_id, resource_type, resource_id, action, quantity_changed) VALUES (?, ?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, log.getProjectId());
            statement.setString(2, log.getResourceType());
            statement.setInt(3, log.getResourceId());
            statement.setString(4, log.getAction());
            statement.setObject(5, log.getQuantityChanged());
            return statement;
        }, keyHolder);
        return getProjectResourceLogById(getGeneratedId(keyHolder));
    }

    /**
     * Deletes a project resource log.
     *
     * @param logId The log id.
     *
     * @return int The number of rows affected.
     */
    public int deleteProjectResourceLog(int logId) {
        return jdbcTemplate.update("DELETE FROM project_resource_logs WHERE log_id = ?;", logId);
    }

    /**
     * Maps a row in the ResultSet to a ProjectResourceLog object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return ProjectResourceLog The project resource log object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private ProjectResourceLog mapToProjectResourceLog(ResultSet resultSet, int rowNumber) throws SQLException {
        return new ProjectResourceLog(
                resultSet.getInt("log_id"),
                resultSet.getInt("project_id"),
                resultSet.getString("resource_type"),
                resultSet.getInt("resource_id"),
                resultSet.getString("action"),
                resultSet.getInt("quantity_changed"),
                resultSet.getTimestamp("created_at").toLocalDateTime());
    }
}
