package org.example.dtos;

import org.example.models.Project;

import java.time.LocalDate;

/**
 * Request data for an administrator creating or updating a user's project.
 */
public record CreateAdminProjectDto(
        String username,
        int patternId,
        String name,
        String status,
        boolean isPublic,
        String care,
        String gauge,
        String[] tags,
        LocalDate dateStarted,
        LocalDate dateFinished,
        LocalDate dateNeededBy) {

    /**
     * Converts this request into the project model persisted by the project DAO.
     *
     * @return The project to persist.
     */
    public Project toProject() {
        return new Project(
                0,
                username,
                patternId,
                name,
                status,
                isPublic,
                care,
                gauge,
                dateStarted,
                dateFinished,
                dateNeededBy,
                null,
                null);
    }
}
