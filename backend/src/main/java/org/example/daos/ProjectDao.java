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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Data access object for projects.
 */
@Component
public class ProjectDao extends JdbcDao {
    private static final Map<String, String> FILTER_COLUMNS = Map.ofEntries(
            Map.entry("name", "name"),
            Map.entry("username", "username"),
            Map.entry("status", "status"),
            Map.entry("public", "CASE WHEN is_public THEN 'public' ELSE 'private' END"),
            Map.entry("care", "care"),
            Map.entry("gauge", "gauge"),
            Map.entry("dateStarted", "date_started"),
            Map.entry("dateFinished", "date_finished"),
            Map.entry("dateNeededBy", "date_needed_by"),
            Map.entry("createdAt", "created_at"),
            Map.entry("updatedAt", "updated_at"));

    private static final Map<String, String> SORT_COLUMNS = Map.of(
            "name", "name",
            "createdAt", "created_at",
            "updatedAt", "updated_at");

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
     * Gets all projects using database-side filtering and sorting.
     *
     * @param filterField The API field to filter, or null.
     * @param filterText The case-insensitive text to find, or null.
     * @param sortField The API field to sort.
     * @param sortDirection Either ascending or descending.
     * @return Matching projects in the requested order.
     */
    public List<Project> getProjects(
            String filterField,
            String filterText,
            String sortField,
            String sortDirection) {
        return queryProjects(null, false, filterField, filterText, sortField, sortDirection);
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
     * Gets a user's projects using database-side filtering and sorting.
     *
     * @param username The project owner.
     * @param filterField The API field to filter, or null.
     * @param filterText The case-insensitive text to find, or null.
     * @param sortField The API field to sort.
     * @param sortDirection Either ascending or descending.
     * @return Matching projects in the requested order.
     */
    public List<Project> getProjectsByUsername(
            String username,
            String filterField,
            String filterText,
            String sortField,
            String sortDirection) {
        return queryProjects(username, false, filterField, filterText, sortField, sortDirection);
    }

    /**
     * Gets projects owned by a user together with public projects owned by other users.
     *
     * @param username The username of the user viewing the projects.
     * @return The projects visible to the user.
     */
    public List<Project> getVisibleProjectsByUsername(String username) {
        return jdbcTemplate.query(
                "SELECT * FROM projects WHERE username = ? OR is_public = TRUE ORDER BY project_id;",
                this::mapToProject,
                username);
    }

    /**
     * Gets projects visible to a user using database-side filtering and sorting.
     *
     * @param username The username of the user viewing the projects.
     * @param filterField The API field to filter, or null.
     * @param filterText The case-insensitive text to find, or null.
     * @param sortField The API field to sort.
     * @param sortDirection Either ascending or descending.
     * @return Matching visible projects in the requested order.
     */
    public List<Project> getVisibleProjectsByUsername(
            String username,
            String filterField,
            String filterText,
            String sortField,
            String sortDirection) {
        return queryProjects(username, true, filterField, filterText, sortField, sortDirection);
    }

    private List<Project> queryProjects(
            String username,
            boolean includePublic,
            String filterField,
            String filterText,
            String sortField,
            String sortDirection) {
        StringBuilder sql = new StringBuilder("SELECT * FROM projects");
        List<Object> parameters = new ArrayList<>();

        if (username != null) {
            sql.append(includePublic
                    ? " WHERE (username = ? OR is_public = TRUE)"
                    : " WHERE username = ?");
            parameters.add(username);
        }

        if (filterText != null && !filterText.isBlank()) {
            String filterColumn = FILTER_COLUMNS.get(filterField);
            sql.append(username == null ? " WHERE" : " AND")
                    .append(" LOWER(COALESCE(CAST(")
                    .append(filterColumn)
                    .append(" AS CHAR), '')) LIKE LOWER(?) ESCAPE '\\\\'");
            parameters.add("%" + escapeLikeValue(filterText.trim()) + "%");
        }

        boolean descending = "descending".equals(sortDirection);
        sql.append(" ORDER BY ")
                .append(SORT_COLUMNS.get(sortField))
                .append(descending ? " DESC" : " ASC")
                .append(", project_id")
                .append(descending ? " DESC" : " ASC")
                .append(";");

        return jdbcTemplate.query(sql.toString(), this::mapToProject, parameters.toArray());
    }

    /**
     * Checks whether a field can be used to filter projects.
     *
     * @param field The API field name.
     * @return Whether the field is supported.
     */
    public boolean isFilterFieldSupported(String field) {
        return FILTER_COLUMNS.containsKey(field);
    }

    /**
     * Checks whether a field can be used to sort projects.
     *
     * @param field The API field name.
     * @return Whether the field is supported.
     */
    public boolean isSortFieldSupported(String field) {
        return SORT_COLUMNS.containsKey(field);
    }

    private String escapeLikeValue(String value) {
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
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
