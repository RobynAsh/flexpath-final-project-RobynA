package org.example.daos;

import org.example.exceptions.DaoException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.KeyHolder;

import javax.sql.DataSource;

/**
 * Base class for JDBC data access objects.
 */
abstract class JdbcDao {
    /**
     * The JDBC template for querying the database.
     */
    protected final JdbcTemplate jdbcTemplate;

    /**
     * Creates a new JDBC data access object.
     *
     * @param dataSource The data source for the DAO.
     */
    protected JdbcDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    /**
     * Gets the generated id from a key holder.
     *
     * @param keyHolder The key holder returned by the insert operation.
     * @return int The generated id.
     */
    protected int getGeneratedId(KeyHolder keyHolder) {
        if (keyHolder.getKey() == null) {
            throw new DaoException("Failed to get generated id.");
        }
        return keyHolder.getKey().intValue();
    }
}
