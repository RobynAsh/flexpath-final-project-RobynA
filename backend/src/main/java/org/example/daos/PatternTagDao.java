package org.example.daos;

import org.example.models.PatternTag;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data access object for pattern tags.
 */
@Component
public class PatternTagDao extends JdbcDao {
    /**
     * Creates a new pattern tag data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public PatternTagDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all pattern tags.
     *
     * @return List of PatternTag
     */
    public List<PatternTag> getPatternTags() {
        return jdbcTemplate.query("SELECT * FROM pattern_tags ORDER BY pattern_id, tag_id;", this::mapToPatternTag);
    }

    /**
     * Gets all pattern tags by pattern id.
     *
     * @param patternId The pattern id for the given tag(s).
     *
     * @return List of PatternTag
     */
    public List<PatternTag> getPatternTagsByPatternId(int patternId) {
        return jdbcTemplate.query("SELECT * FROM pattern_tags WHERE pattern_id = ? ORDER BY tag_id;", this::mapToPatternTag, patternId);
    }

    /**
     * Gets a pattern tag.
     *
     * @param patternId The pattern id.
     * @param tagId The tag id.
     *
     * @return PatternTag
     */
    public PatternTag getPatternTag(int patternId, int tagId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM pattern_tags WHERE pattern_id = ? AND tag_id = ?;",
                    this::mapToPatternTag,
                    patternId,
                    tagId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new pattern tag.
     *
     * @param patternTag The pattern tag.
     *
     * @return PatternTag
     */
    public PatternTag createPatternTag(PatternTag patternTag) {
        jdbcTemplate.update(
                "INSERT INTO pattern_tags (pattern_id, tag_id) VALUES (?, ?);",
                patternTag.getPatternId(),
                patternTag.getTagId());
        return getPatternTag(patternTag.getPatternId(), patternTag.getTagId());
    }

    /**
     * Deletes a pattern tag.
     *
     * @param patternId The pattern id.
     * @param tagId The tag id.
     *
     * @return int The number of rows affected.
     */
    public int deletePatternTag(int patternId, int tagId) {
        return jdbcTemplate.update("DELETE FROM pattern_tags WHERE pattern_id = ? AND tag_id = ?;", patternId, tagId);
    }

    /**
     * Maps a row in the ResultSet to a PatternTag object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return PatternTag The pattern tag object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private PatternTag mapToPatternTag(ResultSet resultSet, int rowNumber) throws SQLException {
        return new PatternTag(
                resultSet.getInt("pattern_id"),
                resultSet.getInt("tag_id"));
    }
}
