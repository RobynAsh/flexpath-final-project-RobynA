package org.example.daos;

import org.example.models.ProjectMaterial;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data access object for project materials.
 */
@Component
public class ProjectMaterialDao extends JdbcDao {
    /**
     * Creates a new project material data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public ProjectMaterialDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all project materials.
     *
     * @return List of ProjectMaterial
     */
    public List<ProjectMaterial> getProjectMaterials() {
        return jdbcTemplate.query("SELECT * FROM project_materials ORDER BY project_id, pattern_material_id;", this::mapToProjectMaterial);
    }

    /**
     * Gets all project materials by project id. If a project material is returned, it means the user "owns/has" the material.
     * We do not track material in the same "Stash" format, only allowing the mark if they have the material on the project itself.
     *
     * @param projectId The project id for the given material assignment(s).
     *
     * @return List of ProjectMaterial
     */
    public List<ProjectMaterial> getProjectMaterialsByProjectId(int projectId) {
        return jdbcTemplate.query("SELECT * FROM project_materials WHERE project_id = ? ORDER BY pattern_material_id;", this::mapToProjectMaterial, projectId);
    }

    /**
     * Gets a project material.
     *
     * @param patternMaterialId The pattern material id.
     * @param projectId The project id.
     *
     * @return ProjectMaterial
     */
    public ProjectMaterial getProjectMaterial(int patternMaterialId, int projectId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM project_materials WHERE pattern_material_id = ? AND project_id = ?;",
                    this::mapToProjectMaterial,
                    patternMaterialId,
                    projectId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new project material.
     *
     * @param projectMaterial The project material.
     *
     * @return ProjectMaterial
     */
    public ProjectMaterial createProjectMaterial(ProjectMaterial projectMaterial) {
        jdbcTemplate.update(
                "INSERT INTO project_materials (pattern_material_id, project_id) VALUES (?, ?);",
                projectMaterial.getPatternMaterialId(),
                projectMaterial.getProjectId());
        return getProjectMaterial(projectMaterial.getPatternMaterialId(), projectMaterial.getProjectId());
    }

    /**
     * Deletes a project material.
     *
     * @param patternMaterialId The pattern material id.
     * @param projectId The project id.
     *
     * @return int The number of rows affected.
     */
    public int deleteProjectMaterial(int patternMaterialId, int projectId) {
        return jdbcTemplate.update(
                "DELETE FROM project_materials WHERE pattern_material_id = ? AND project_id = ?;",
                patternMaterialId,
                projectId);
    }

    /**
     * Maps a row in the ResultSet to a ProjectMaterial object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return ProjectMaterial The project material object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private ProjectMaterial mapToProjectMaterial(ResultSet resultSet, int rowNumber) throws SQLException {
        return new ProjectMaterial(
                resultSet.getInt("pattern_material_id"),
                resultSet.getInt("project_id"));
    }
}
