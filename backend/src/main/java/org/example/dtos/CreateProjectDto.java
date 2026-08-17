package org.example.dtos;

import org.example.models.Project;

import java.time.LocalDate;

/**
 * Request data for creating a project.
 */
public record CreateProjectDto(
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
                null,
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
