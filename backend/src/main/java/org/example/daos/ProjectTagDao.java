package org.example.daos;

import org.example.models.ProjectTag;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data access object for project tags.
 */
@Component
public class ProjectTagDao extends JdbcDao {
    /**
     * Creates a new project tag data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public ProjectTagDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all project tags by project id.
     *
     * @param projectId The project id for the given tags.
     * @return The project tags.
     */
    public List<ProjectTag> getProjectTagsByProjectId(int projectId) {
        return jdbcTemplate.query(
                "SELECT * FROM project_tags WHERE project_id = ? ORDER BY tag_id;",
                this::mapToProjectTag,
                projectId);
    }

    /**
     * Gets a project tag.
     *
     * @param projectId The project id.
     * @param tagId The tag id.
     * @return The project tag, or null if it does not exist.
     */
    public ProjectTag getProjectTag(int projectId, int tagId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM project_tags WHERE project_id = ? AND tag_id = ?;",
                    this::mapToProjectTag,
                    projectId,
                    tagId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a project tag.
     *
     * @param projectTag The project tag.
     * @return The created project tag.
     */
    public ProjectTag createProjectTag(ProjectTag projectTag) {
        jdbcTemplate.update(
                "INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?);",
                projectTag.getProjectId(),
                projectTag.getTagId());
        return getProjectTag(projectTag.getProjectId(), projectTag.getTagId());
    }

    /**
     * Deletes a tag assignment from a project.
     *
     * @param projectId The project id.
     * @param tagId The tag id.
     * @return The number of rows affected.
     */
    public int deleteProjectTag(int projectId, int tagId) {
        return jdbcTemplate.update(
                "DELETE FROM project_tags WHERE project_id = ? AND tag_id = ?;",
                projectId,
                tagId);
    }

    /**
     * Maps a row in the result set to a project tag.
     *
     * @param resultSet The result set.
     * @param rowNumber The row number.
     * @return The project tag.
     * @throws SQLException If the row cannot be mapped.
     */
    private ProjectTag mapToProjectTag(ResultSet resultSet, int rowNumber) throws SQLException {
        return new ProjectTag(
                resultSet.getInt("project_id"),
                resultSet.getInt("tag_id"));
    }
}
