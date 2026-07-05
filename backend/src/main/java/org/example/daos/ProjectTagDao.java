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
     * Gets all project tags.
     *
     * @return List of ProjectTag
     */
    public List<ProjectTag> getProjectTags() {
        return jdbcTemplate.query("SELECT * FROM project_tags ORDER BY project_id, tag_id;", this::mapToProjectTag);
    }

    /**
     * Gets all project tags by project id.
     *
     * @param projectId The project id.
     *
     * @return List of ProjectTag
     */
    public List<ProjectTag> getProjectTagsByProjectId(int projectId) {
        return jdbcTemplate.query("SELECT * FROM project_tags WHERE project_id = ? ORDER BY tag_id;", this::mapToProjectTag, projectId);
    }

    /**
     * Gets a project tag.
     *
     * @param projectId The project id.
     * @param tagId The tag id.
     *
     * @return ProjectTag
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
     * Creates a new project tag.
     *
     * @param projectTag The project tag.
     *
     * @return ProjectTag
     */
    public ProjectTag createProjectTag(ProjectTag projectTag) {
        jdbcTemplate.update(
                "INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?);",
                projectTag.getProjectId(),
                projectTag.getTagId());
        return getProjectTag(projectTag.getProjectId(), projectTag.getTagId());
    }

    /**
     * Deletes a project tag.
     *
     * @param projectId The project id.
     * @param tagId The tag id.
     *
     * @return int The number of rows affected.
     */
    public int deleteProjectTag(int projectId, int tagId) {
        return jdbcTemplate.update("DELETE FROM project_tags WHERE project_id = ? AND tag_id = ?;", projectId, tagId);
    }

    /**
     * Maps a row in the ResultSet to a ProjectTag object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return ProjectTag The project tag object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private ProjectTag mapToProjectTag(ResultSet resultSet, int rowNumber) throws SQLException {
        return new ProjectTag(
                resultSet.getInt("project_id"),
                resultSet.getInt("tag_id"));
    }
}
