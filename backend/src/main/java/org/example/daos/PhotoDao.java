package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Photo;
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
 * Data access object for photos.
 */
@Component
public class PhotoDao extends JdbcDao {
    /**
     * Creates a new photo data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    public PhotoDao(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * Gets all photos.
     *
     * @return List of Photo
     */
    public List<Photo> getPhotos() {
        return jdbcTemplate.query("SELECT * FROM photos ORDER BY photo_id;", this::mapToPhoto);
    }

    /**
     * Gets all photos by project id.
     *
     * @param projectId The project id for the given photo(s).
     *
     * @return List of Photo
     */
    public List<Photo> getPhotosByProjectId(int projectId) {
        return jdbcTemplate.query("SELECT * FROM photos WHERE project_id = ? ORDER BY photo_id;", this::mapToPhoto, projectId);
    }

    /**
     * Gets a photo by id.
     *
     * @param photoId The photo id.
     *
     * @return Photo
     */
    public Photo getPhotoById(int photoId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM photos WHERE photo_id = ?;", this::mapToPhoto, photoId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new photo.
     *
     * @param photo The photo.
     *
     * @return Photo
     */
    public Photo createPhoto(Photo photo) {
        String sql = "INSERT INTO photos (project_id, milestone_id, image_url, is_marquee) VALUES (?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, photo.getProjectId());
            statement.setObject(2, photo.getMilestoneId());
            statement.setString(3, photo.getImageUrl());
            statement.setBoolean(4, photo.isMarquee());
            return statement;
        }, keyHolder);
        return getPhotoById(getGeneratedId(keyHolder));
    }

    /**
     * Updates a photo.
     *
     * @param photo The photo.
     *
     * @return Photo
     */
    public Photo updatePhoto(Photo photo) {
        int rowsAffected = jdbcTemplate.update(
                "UPDATE photos SET project_id = ?, milestone_id = ?, image_url = ?, is_marquee = ? WHERE photo_id = ?;",
                photo.getProjectId(),
                photo.getMilestoneId(),
                photo.getImageUrl(),
                photo.isMarquee(),
                photo.getPhotoId());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        }
        return getPhotoById(photo.getPhotoId());
    }

    /**
     * Deletes a photo.
     *
     * @param photoId The photo id.
     *
     * @return int The number of rows affected.
     */
    public int deletePhoto(int photoId) {
        return jdbcTemplate.update("DELETE FROM photos WHERE photo_id = ?;", photoId);
    }

    /**
     * Maps a row in the ResultSet to a Photo object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return Photo The photo object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private Photo mapToPhoto(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Photo(
                resultSet.getInt("photo_id"),
                resultSet.getInt("project_id"),
                resultSet.getObject("milestone_id", Integer.class),
                resultSet.getString("image_url"),
                resultSet.getBoolean("is_marquee"),
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                resultSet.getTimestamp("updated_at").toLocalDateTime());
    }
}
