package org.example.dtos;

import org.example.models.Milestone;

/**
 * A milestone with the project and owner information needed by the admin UI.
 *
 * @param projectName The name of the milestone's project.
 * @param username The owner of the milestone's project.
 * @param milestone The milestone.
 */
public record AdminMilestoneDto(
        String projectName,
        String username,
        Milestone milestone) {
}
