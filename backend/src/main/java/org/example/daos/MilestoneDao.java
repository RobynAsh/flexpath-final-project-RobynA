package org.example.daos;

import org.example.exceptions.DaoException;
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
import java.util.List;

/**
 * Data access object for milestones.
 */
@Component
public class MilestoneDao extends JdbcDao {
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
     * Gets all milestones by project id.
     *
     * @param projectId The project id that owns the given milestone(s).
     *
     * @return List of Milestone
     */
    public List<Milestone> getMilestonesByProjectId(int projectId) {
        return jdbcTemplate.query("SELECT * FROM milestones WHERE project_id = ? ORDER BY milestone_id;", this::mapToMilestone, projectId);
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
