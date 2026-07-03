package org.example.models;

/**
 * Model class for pattern tags.
 */
public class PatternTag {
    private int patternId;
    private int tagId;

    public PatternTag(int patternId, int tagId) {
        this.patternId = patternId;
        this.tagId = tagId;
    }

    public int getPatternId() {
        return patternId;
    }

    public void setPatternId(int patternId) {
        this.patternId = patternId;
    }

    public int getTagId() {
        return tagId;
    }

    public void setTagId(int tagId) {
        this.tagId = tagId;
    }
}
