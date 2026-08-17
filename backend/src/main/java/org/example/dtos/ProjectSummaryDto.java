package org.example.dtos;

import org.example.models.Project;
import org.example.models.Tag;

import java.util.List;

/**
 * A project and its tags.
 */
public record ProjectSummaryDto(
        Project project,
        List<Tag> tags) {
}
