package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Tag;
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
 * Data access object for tags.
 */
@Component
public class TagDao extends JdbcDao {
    /**
     * Creates a new tag data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public TagDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all tags.
     *
     * @return List of Tag
     */
    public List<Tag> getTags() {
        return jdbcTemplate.query("SELECT * FROM tags ORDER BY tag_id;", this::mapToTag);
    }

    /**
     * Gets all tags by username.
     *
     * @param username The username.
     *
     * @return List of Tag
     */
    public List<Tag> getTagsByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM tags WHERE username = ? ORDER BY name;", this::mapToTag, username);
    }

    /**
     * Gets a tag by id.
     *
     * @param tagId The tag id.
     *
     * @return Tag
     */
    public Tag getTagById(int tagId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM tags WHERE tag_id = ?;", this::mapToTag, tagId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new tag.
     *
     * @param tag The tag.
     *
     * @return Tag
     */
    public Tag createTag(Tag tag) {
        String sql = "INSERT INTO tags (username, name) VALUES (?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, tag.getUsername());
            statement.setString(2, tag.getName());
            return statement;
        }, keyHolder);
        return getTagById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a tag.
     *
     * @param tag The tag.
     *
     * @return Tag
     */
    public Tag updateTag(Tag tag) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE tags SET username = ?, name = ? WHERE tag_id = ?;",
                tag.getUsername(),
                tag.getName(),
                tag.getTagId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getTagById(tag.getTagId());
    }

    /**
     * Deletes a tag.
     *
     * @param tagId The tag id.
     *
     * @return int The number of rows affected.
     */
    public int deleteTag(int tagId) {
        return jdbcTemplate.update("DELETE FROM tags WHERE tag_id = ?;", tagId);
    }

    /**
     * Maps a row in the ResultSet to a Tag object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Tag The tag object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Tag mapToTag(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Tag(
                resultSet.getInt("tag_id"),
                resultSet.getString("username"),
                resultSet.getString("name"));
    }
}
