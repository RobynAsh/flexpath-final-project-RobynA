package org.example.models;

/**
 * Model class for pattern tools.
 */
public class PatternTool {
    /**
     * The unique identifier of the pattern tool.
     */
    private int patternToolId;

    /**
     * The unique identifier of the pattern.
     */
    private int patternId;

    /**
     * The type of tool needed by the pattern.
     */
    private String toolType;

    /**
     * The tool size in millimeters.
     */
    private float sizeMm;

    /**
     * Creates a new pattern tool.
     *
     * @param patternToolId The unique identifier of the pattern tool.
     * @param patternId The unique identifier of the pattern.
     * @param toolType The type of tool needed by the pattern.
     * @param sizeMm The tool size in millimeters.
     */
    public PatternTool(int patternToolId, int patternId, String toolType, float sizeMm) {
        this.patternToolId = patternToolId;
        this.patternId = patternId;
        this.toolType = toolType;
        this.sizeMm = sizeMm;
    }

    /**
     * Gets the unique identifier of the pattern tool.
     *
     * @return The unique identifier of the pattern tool.
     */
    public int getPatternToolId() {
        return patternToolId;
    }

    /**
     * Sets the unique identifier of the pattern tool.
     *
     * @param patternToolId The unique identifier of the pattern tool.
     */
    public void setPatternToolId(int patternToolId) {
        this.patternToolId = patternToolId;
    }

    /**
     * Gets the unique identifier of the pattern.
     *
     * @return The unique identifier of the pattern.
     */
    public int getPatternId() {
        return patternId;
    }

    /**
     * Sets the unique identifier of the pattern.
     *
     * @param patternId The unique identifier of the pattern.
     */
    public void setPatternId(int patternId) {
        this.patternId = patternId;
    }

    /**
     * Gets the type of tool needed by the pattern.
     *
     * @return The type of tool needed by the pattern.
     */
    public String getToolType() {
        return toolType;
    }

    /**
     * Sets the type of tool needed by the pattern.
     *
     * @param toolType The type of tool needed by the pattern.
     */
    public void setToolType(String toolType) {
        this.toolType = toolType;
    }

    /**
     * Gets the tool size in millimeters.
     *
     * @return The tool size in millimeters.
     */
    public float getSizeMm() {
        return sizeMm;
    }

    /**
     * Sets the tool size in millimeters.
     *
     * @param sizeMm The tool size in millimeters.
     */
    public void setSizeMm(float sizeMm) {
        this.sizeMm = sizeMm;
    }
}
