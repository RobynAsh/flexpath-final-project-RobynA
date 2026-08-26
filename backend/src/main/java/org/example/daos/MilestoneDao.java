package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.dtos.RecentMilestoneDto;
import org.example.models.Milestone;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Data access object for milestones.
 */
@Component
public class MilestoneDao extends JdbcDao {
    private static final Map<String, String> FILTER_COLUMNS = Map.ofEntries(
            Map.entry("projectName", "p.name"),
            Map.entry("username", "p.username"),
            Map.entry("note", "m.note"),
            Map.entry("rowCount", "m.row_count"),
            Map.entry("repeatCount", "m.repeat_count"),
            Map.entry("createdAt", "m.created_at"),
            Map.entry("updatedAt", "m.updated_at"));

    private static final Map<String, String> SORT_COLUMNS = Map.ofEntries(
            Map.entry("projectName", "p.name"),
            Map.entry("username", "p.username"),
            Map.entry("rowCount", "m.row_count"),
            Map.entry("repeatCount", "m.repeat_count"),
            Map.entry("createdAt", "m.created_at"),
            Map.entry("updatedAt", "m.updated_at"));

    /**
     * Creates a new milestone data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public MilestoneDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all milestones.
     *
     * @return List of Milestone
     */
    public List<Milestone> getMilestones() {
        return jdbcTemplate.query("SELECT * FROM milestones ORDER BY milestone_id;", this::mapToMilestone);
    }

    /**
     * Gets all milestones using database-side filtering and sorting.
     *
     * @param filterField The API field to filter, or null.
     * @param filterText The case-insensitive text to find, or null.
     * @param sortField The API field to sort.
     * @param sortDirection Either ascending or descending.
     * @return Matching milestones in the requested order.
     */
    public List<Milestone> getMilestones(
            String filterField,
            String filterText,
            String sortField,
            String sortDirection) {
        StringBuilder sql = new StringBuilder(
                "SELECT m.* FROM milestones m INNER JOIN projects p ON p.project_id = m.project_id");
        List<Object> parameters = new ArrayList<>();

        if (filterText != null && !filterText.isBlank()) {
            sql.append(" WHERE LOWER(COALESCE(CAST(")
                    .append(FILTER_COLUMNS.get(filterField))
                    .append(" AS CHAR), '')) LIKE LOWER(?) ESCAPE '\\\\'");
            parameters.add("%" + escapeLikeValue(filterText.trim()) + "%");
        }

        boolean descending = "descending".equals(sortDirection);
        sql.append(" ORDER BY ")
                .append(SORT_COLUMNS.get(sortField))
                .append(descending ? " DESC" : " ASC")
                .append(", m.milestone_id")
                .append(descending ? " DESC" : " ASC")
                .append(";");

        return jdbcTemplate.query(sql.toString(), this::mapToMilestone, parameters.toArray());
    }

    /**
     * Checks whether a field can be used to filter milestones.
     *
     * @param field The API field name.
     * @return Whether the field is supported.
     */
    public boolean isFilterFieldSupported(String field) {
        return FILTER_COLUMNS.containsKey(field);
    }

    /**
     * Checks whether a field can be used to sort milestones.
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
     * Gets all milestones by project id.
     *
     * @param projectId The project id that owns the given milestone(s).
     *
     * @return List of Milestone
     */
    public List<Milestone> getMilestonesByProjectId(int projectId) {
        return jdbcTemplate.query(
                "SELECT * FROM milestones WHERE project_id = ? ORDER BY created_at DESC, milestone_id DESC;",
                this::mapToMilestone,
                projectId);
    }

    /**
     * Gets the three most recently created milestones for projects owned by a user.
     *
     * @param username The user who owns the projects.
     * @return The user's three most recent milestones and their project names.
     */
    public List<RecentMilestoneDto> getRecentMilestonesByUsername(String username) {
        return jdbcTemplate.query(
                "SELECT m.*, p.name AS project_name FROM milestones m "
                        + "INNER JOIN projects p ON p.project_id = m.project_id "
                        + "WHERE p.username = ? "
                        + "ORDER BY m.created_at DESC, m.milestone_id DESC LIMIT 3;",
                (resultSet, rowNumber) -> new RecentMilestoneDto(
                        resultSet.getString("project_name"),
                        mapToMilestone(resultSet, rowNumber)),
                username);
    }

    /**
     * Gets a milestone by id.
     *
     * @param milestoneId The milestone id.
     *
     * @return Milestone
     */
    public Milestone getMilestoneById(int milestoneId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM milestones WHERE milestone_id = ?;", this::mapToMilestone, milestoneId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new milestone.
     *
     * @param milestone The milestone.
     *
     * @return Milestone
     */
    public Milestone createMilestone(Milestone milestone) {
        String sql = "INSERT INTO milestones (project_id, note, row_count, repeat_count) VALUES (?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, milestone.getProjectId());
            statement.setString(2, milestone.getNote());
            statement.setInt(3, milestone.getRowCount());
            statement.setInt(4, milestone.getRepeatCount());
            return statement;
        }, keyHolder);
        return getMilestoneById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a milestone.
     *
     * @param milestone The milestone.
     *
     * @return Milestone
     */
    public Milestone updateMilestone(Milestone milestone) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE milestones SET project_id = ?, note = ?, row_count = ?, repeat_count = ? WHERE milestone_id = ?;",
                milestone.getProjectId(),
                milestone.getNote(),
                milestone.getRowCount(),
                milestone.getRepeatCount(),
                milestone.getMilestoneId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getMilestoneById(milestone.getMilestoneId());
    }

    /**
     * Deletes a milestone.
     *
     * @param milestoneId The milestone id.
     *
     * @return int The number of rows affected.
     */
    public int deleteMilestone(int milestoneId) {
        return jdbcTemplate.update("DELETE FROM milestones WHERE milestone_id = ?;", milestoneId);
    }

    /**
     * Maps a row in the ResultSet to a Milestone object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Milestone The milestone object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Milestone mapToMilestone(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Milestone(
                resultSet.getInt("milestone_id"),
                resultSet.getInt("project_id"),
                resultSet.getString("note"),
                resultSet.getInt("row_count"),
                resultSet.getInt("repeat_count"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime());
    }
}
