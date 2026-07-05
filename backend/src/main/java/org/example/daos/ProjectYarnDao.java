package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.ProjectYarn;
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
 * Data access object for project yarns.
 */
@Component
public class ProjectYarnDao extends JdbcDao {
    /**
     * Creates a new project yarn data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public ProjectYarnDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all project yarns.
     *
     * @return List of ProjectYarn
     */
    public List<ProjectYarn> getProjectYarns() {
        return jdbcTemplate.query("SELECT * FROM project_yarns ORDER BY project_yarn_id;", this::mapToProjectYarn);
    }

    /**
     * Gets all project yarns by project id.
     *
     * @param projectId The project id.
     *
     * @return List of ProjectYarn
     */
    public List<ProjectYarn> getProjectYarnsByProjectId(int projectId) {
        return jdbcTemplate.query("SELECT * FROM project_yarns WHERE project_id = ? ORDER BY project_yarn_id;", this::mapToProjectYarn, projectId);
    }

    /**
     * Gets a project yarn by id.
     *
     * @param projectYarnId The project yarn id.
     *
     * @return ProjectYarn
     */
    public ProjectYarn getProjectYarnById(int projectYarnId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM project_yarns WHERE project_yarn_id = ?;", this::mapToProjectYarn, projectYarnId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new project yarn.
     *
     * @param projectYarn The project yarn.
     *
     * @return ProjectYarn
     */
    public ProjectYarn createProjectYarn(ProjectYarn projectYarn) {
        String sql = "INSERT INTO project_yarns (project_id, pattern_yarn_id, stash_yarn_id, yardage_used) VALUES (?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, projectYarn.getProjectId());
            statement.setObject(2, projectYarn.getPatternYarnId());
            statement.setObject(3, projectYarn.getStashYarnId());
            statement.setInt(4, projectYarn.getYardageUsed());
            return statement;
        }, keyHolder);
        return getProjectYarnById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a project yarn.
     *
     * @param projectYarn The project yarn.
     *
     * @return ProjectYarn
     */
    public ProjectYarn updateProjectYarn(ProjectYarn projectYarn) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE project_yarns SET project_id = ?, pattern_yarn_id = ?, stash_yarn_id = ?, yardage_used = ?, removed_at = ? WHERE project_yarn_id = ?;",
                projectYarn.getProjectId(),
                projectYarn.getPatternYarnId(),
                projectYarn.getStashYarnId(),
                projectYarn.getYardageUsed(),
                projectYarn.getRemovedAt(),
                projectYarn.getProjectYarnId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getProjectYarnById(projectYarn.getProjectYarnId());
    }

    /**
     * Deletes a project yarn.
     *
     * @param projectYarnId The project yarn id.
     *
     * @return int The number of rows affected.
     */
    public int deleteProjectYarn(int projectYarnId) {
        return jdbcTemplate.update("DELETE FROM project_yarns WHERE project_yarn_id = ?;", projectYarnId);
    }

    /**
     * Maps a row in the ResultSet to a ProjectYarn object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return ProjectYarn The project yarn object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private ProjectYarn mapToProjectYarn(ResultSet resultSet, int rowNumber) throws SQLException {
        return new ProjectYarn(
                resultSet.getInt("project_yarn_id"),
                resultSet.getInt("project_id"),
                resultSet.getInt("pattern_yarn_id"),
                resultSet.getInt("stash_yarn_id"),
                resultSet.getInt("yardage_used"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime(),
                resultSet.getTimestamp("removed_at") == null ? null : resultSet.getTimestamp("removed_at").toLocalDateTime());
    }
}
