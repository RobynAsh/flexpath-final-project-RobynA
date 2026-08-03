package org.example.dtos;

import org.example.models.Pattern;
import org.example.models.PatternMaterial;
import org.example.models.PatternTool;
import org.example.models.PatternYarn;
import org.example.models.Tag;

import java.util.List;

/**
 * A pattern and the resources associated with it.
 */
public record PatternDto(
        Pattern pattern,
        List<Tag> tags,
        List<PatternYarn> yarn,
        List<PatternTool> tools,
        List<PatternMaterial> materials) {
}
