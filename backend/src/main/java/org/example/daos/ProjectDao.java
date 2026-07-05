package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Project;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

/**
 * Data access object for projects.
 */
@Component
public class ProjectDao extends JdbcDao {
    /**
     * Creates a new project data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public ProjectDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all projects.
     *
     * @return List of Project
     */
    public List<Project> getProjects() {
        return jdbcTemplate.query("SELECT * FROM projects ORDER BY project_id;", this::mapToProject);
    }

    /**
     * Gets all projects by username.
     *
     * @param username The username for the user that owns the given project(s).
     *
     * @return List of Project
     */
    public List<Project> getProjectsByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM projects WHERE username = ? ORDER BY project_id;", this::mapToProject, username);
    }

    /**
     * Gets a project by id.
     *
     * @param projectId The project id.
     *
     * @return Project
     */
    public Project getProjectById(int projectId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM projects WHERE project_id = ?;", this::mapToProject, projectId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new project.
     *
     * @param project The project.
     *
     * @return Project
     */
    public Project createProject(Project project) {
        String sql = "INSERT INTO projects (username, pattern_id, name, status, is_public, care, gauge, date_started, date_finished, date_needed_by) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, project.getUsername());
            statement.setObject(2, project.getPatternId());
            statement.setString(3, project.getName());
            statement.setString(4, project.getStatus());
            statement.setBoolean(5, project.isPublic());
            statement.setString(6, project.getCare());
            statement.setString(7, project.getGauge());
            statement.setDate(8, project.getDateStarted() == null ? null : Date.valueOf(project.getDateStarted()));
            statement.setDate(9, project.getDateFinished() == null ? null : Date.valueOf(project.getDateFinished()));
            statement.setDate(10, project.getDateNeededBy() == null ? null : Date.valueOf(project.getDateNeededBy()));
            return statement;
        }, keyHolder);
        return getProjectById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a project.
     *
     * @param project The project.
     *
     * @return Project
     */
    public Project updateProject(Project project) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE projects SET username = ?, pattern_id = ?, name = ?, status = ?, is_public = ?, care = ?, gauge = ?, date_started = ?, date_finished = ?, date_needed_by = ? WHERE project_id = ?;",
                project.getUsername(),
                project.getPatternId(),
                project.getName(),
                project.getStatus(),
                project.isPublic(),
                project.getCare(),
                project.getGauge(),
                project.getDateStarted(),
                project.getDateFinished(),
                project.getDateNeededBy(),
                project.getProjectId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getProjectById(project.getProjectId());
    }

    /**
     * Deletes a project.
     *
     * @param projectId The project id.
     *
     * @return int The number of rows affected.
     */
    public int deleteProject(int projectId) {
        return jdbcTemplate.update("DELETE FROM projects WHERE project_id = ?;", projectId);
    }

    /**
     * Maps a row in the ResultSet to a Project object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Project The project object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Project mapToProject(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Project(
                resultSet.getInt("project_id"),
                resultSet.getString("username"),
                resultSet.getInt("pattern_id"),
                resultSet.getString("name"),
                resultSet.getString("status"),
                resultSet.getBoolean("is_public"),
                resultSet.getString("care"),
                resultSet.getString("gauge"),
                resultSet.getDate("date_started") == null ? null : resultSet.getDate("date_started").toLocalDate(),
                resultSet.getDate("date_finished") == null ? null : resultSet.getDate("date_finished").toLocalDate(),
                resultSet.getDate("date_needed_by") == null ? null : resultSet.getDate("date_needed_by").toLocalDate(),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime());
    }
}
