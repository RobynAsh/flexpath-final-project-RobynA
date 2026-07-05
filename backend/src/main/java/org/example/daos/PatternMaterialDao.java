package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.PatternMaterial;
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
 * Data access object for pattern materials.
 */
@Component
public class PatternMaterialDao extends JdbcDao {
    /**
     * Creates a new pattern material data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public PatternMaterialDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all pattern materials.
     *
     * @return List of PatternMaterial
     */
    public List<PatternMaterial> getPatternMaterials() {
        return jdbcTemplate.query("SELECT * FROM pattern_materials ORDER BY pattern_material_id;", this::mapToPatternMaterial);
    }

    /**
     * Gets all pattern materials by pattern id.
     *
     * @param patternId The pattern id for the given material(s).
     *
     * @return List of PatternMaterial
     */
    public List<PatternMaterial> getPatternMaterialsByPatternId(int patternId) {
        return jdbcTemplate.query("SELECT * FROM pattern_materials WHERE pattern_id = ? ORDER BY pattern_material_id;", this::mapToPatternMaterial, patternId);
    }

    /**
     * Gets a pattern material by id.
     *
     * @param patternMaterialId The pattern material id.
     *
     * @return PatternMaterial
     */
    public PatternMaterial getPatternMaterialById(int patternMaterialId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM pattern_materials WHERE pattern_material_id = ?;", this::mapToPatternMaterial, patternMaterialId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new pattern material.
     *
     * @param patternMaterial The pattern material.
     *
     * @return PatternMaterial
     */
    public PatternMaterial createPatternMaterial(PatternMaterial patternMaterial) {
        String sql = "INSERT INTO pattern_materials (pattern_id, name, description, quantity) VALUES (?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, patternMaterial.getPatternId());
            statement.setString(2, patternMaterial.getName());
            statement.setString(3, patternMaterial.getDescription());
            statement.setInt(4, patternMaterial.getQuantity());
            return statement;
        }, keyHolder);
        return getPatternMaterialById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a pattern material.
     *
     * @param patternMaterial The pattern material.
     *
     * @return PatternMaterial
     */
    public PatternMaterial updatePatternMaterial(PatternMaterial patternMaterial) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE pattern_materials SET pattern_id = ?, name = ?, description = ?, quantity = ? WHERE pattern_material_id = ?;",
                patternMaterial.getPatternId(),
                patternMaterial.getName(),
                patternMaterial.getDescription(),
                patternMaterial.getQuantity(),
                patternMaterial.getPatternMaterialId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getPatternMaterialById(patternMaterial.getPatternMaterialId());
    }

    /**
     * Deletes a pattern material.
     *
     * @param patternMaterialId The pattern material id.
     *
     * @return int The number of rows affected.
     */
    public int deletePatternMaterial(int patternMaterialId) {
        return jdbcTemplate.update("DELETE FROM pattern_materials WHERE pattern_material_id = ?;", patternMaterialId);
    }

    /**
     * Maps a row in the ResultSet to a PatternMaterial object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return PatternMaterial The pattern material object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private PatternMaterial mapToPatternMaterial(ResultSet resultSet, int rowNumber) throws SQLException {
        return new PatternMaterial(
                resultSet.getInt("pattern_material_id"),
                resultSet.getInt("pattern_id"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getInt("quantity"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime());
    }
}
