package org.example.dtos;

import org.example.models.Milestone;

/**
 * A milestone and the name of the project it belongs to.
 */
public record RecentMilestoneDto(
        String projectName,
        Milestone milestone) {
}
