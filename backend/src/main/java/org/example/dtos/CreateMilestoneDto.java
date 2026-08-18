package org.example.dtos;

import org.example.models.Milestone;

/**
 * Request data for creating a milestone.
 */
public record CreateMilestoneDto(
        int projectId,
        String note,
        int rowCount,
        int repeatCount) {

    /**
     * Converts this request into the milestone model persisted by the DAO.
     *
     * @return The milestone to persist.
     */
    public Milestone toMilestone() {
        return new Milestone(
                0,
                projectId,
                note,
                rowCount,
                repeatCount,
                null,
                null);
    }
}
