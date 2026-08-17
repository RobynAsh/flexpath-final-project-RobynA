package org.example.dtos;

import org.example.models.Pattern;
import org.example.models.PatternMaterial;
import org.example.models.PatternTool;
import org.example.models.PatternYarn;
import org.example.models.Project;
import org.example.models.Tag;

import java.util.List;

/**
 * A project, its pattern, and the resources required by that pattern.
 */
public record ProjectDto(
        Project project,
        List<Tag> tags,
        Pattern pattern,
        List<PatternYarn> yarn,
        List<PatternTool> tools,
        List<PatternMaterial> materials) {
}
