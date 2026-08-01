package org.example.dtos;

import org.example.models.Pattern;
import org.example.models.PatternTool;
import org.example.models.PatternYarn;

/**
 * Request data for creating a pattern and assigning tags, yarn requirements,
 * and tool requirements to it.
 */
public record CreatePatternDto(
        String username,
        String category,
        String technique,
        String name,
        String designer,
        String description,
        String difficulty,
        String link,
        String imageUrl,
        String[] tags,
        PatternYarn[] yarn,
        PatternTool[] tools) {

    /**
     * Converts this request into the pattern model persisted by the pattern DAO.
     *
     * @return The pattern to persist.
     */
    public Pattern toPattern() {
        return new Pattern(
                0,
                username,
                category,
                technique,
                name,
                designer,
                description,
                difficulty,
                link,
                imageUrl,
                null,
                null);
    }
}
