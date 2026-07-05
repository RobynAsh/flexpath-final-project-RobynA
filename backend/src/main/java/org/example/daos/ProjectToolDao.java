package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.ProjectTool;
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
 * Data access object for project tools.
 */
@Component
public class ProjectToolDao extends JdbcDao {
    /**
     * Creates a new project tool data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public ProjectToolDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all project tools.
     *
     * @return List of ProjectTool
     */
    public List<ProjectTool> getProjectTools() {
        return jdbcTemplate.query("SELECT * FROM project_tools ORDER BY project_tool_id;", this::mapToProjectTool);
    }

    /**
     * Gets all project tools by project id.
     *
     * @param projectId The project id.
     *
     * @return List of ProjectTool
     */
    public List<ProjectTool> getProjectToolsByProjectId(int projectId) {
        return jdbcTemplate.query("SELECT * FROM project_tools WHERE project_id = ? ORDER BY project_tool_id;", this::mapToProjectTool, projectId);
    }

    /**
     * Gets a project tool by id.
     *
     * @param projectToolId The project tool id.
     *
     * @return ProjectTool
     */
    public ProjectTool getProjectToolById(int projectToolId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM project_tools WHERE project_tool_id = ?;", this::mapToProjectTool, projectToolId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new project tool.
     *
     * @param projectTool The project tool.
     *
     * @return ProjectTool
     */
    public ProjectTool createProjectTool(ProjectTool projectTool) {
        String sql = "INSERT INTO project_tools (project_id, pattern_tool_id, stash_tool_id) VALUES (?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, projectTool.getProjectId());
            statement.setObject(2, projectTool.getPatternToolId());
            statement.setObject(3, projectTool.getStashToolId());
            return statement;
        }, keyHolder);
        return getProjectToolById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a project tool.
     *
     * @param projectTool The project tool.
     *
     * @return ProjectTool
     */
    public ProjectTool updateProjectTool(ProjectTool projectTool) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE project_tools SET project_id = ?, pattern_tool_id = ?, stash_tool_id = ?, removed_at = ? WHERE project_tool_id = ?;",
                projectTool.getProjectId(),
                projectTool.getPatternToolId(),
                projectTool.getStashToolId(),
                projectTool.getRemovedAt(),
                projectTool.getProjectToolId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getProjectToolById(projectTool.getProjectToolId());
    }

    /**
     * Deletes a project tool.
     *
     * @param projectToolId The project tool id.
     *
     * @return int The number of rows affected.
     */
    public int deleteProjectTool(int projectToolId) {
        return jdbcTemplate.update("DELETE FROM project_tools WHERE project_tool_id = ?;", projectToolId);
    }

    /**
     * Maps a row in the ResultSet to a ProjectTool object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return ProjectTool The project tool object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private ProjectTool mapToProjectTool(ResultSet resultSet, int rowNumber) throws SQLException {
        return new ProjectTool(
                resultSet.getInt("project_tool_id"),
                resultSet.getInt("project_id"),
                resultSet.getInt("pattern_tool_id"),
                resultSet.getInt("stash_tool_id"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("removed_at") == null ? null : resultSet.getTimestamp("removed_at").toLocalDateTime());
    }
}
