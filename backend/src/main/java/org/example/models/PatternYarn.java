package org.example.models;

/**
 * Model class for pattern yarns.
 */
public class PatternYarn {
    /**
     * The unique identifier of the pattern yarn.
     */
    private int patternYarnId;

    /**
     * The unique identifier of the pattern.
     */
    private int patternId;

    /**
     * The unique identifier of the suggested yarn.
     */
    private int suggestedYarnId;

    /**
     * The description of the yarn needed by the pattern.
     */
    private String description;

    /**
     * The yarn weight needed by the pattern.
     */
    private int weight;

    /**
     * The yardage needed by the pattern.
     */
    private int yardage;

    /**
     * The weight in grams needed by the pattern.
     */
    private float grams;

    /**
     * Creates a new pattern yarn.
     *
     * @param patternYarnId The unique identifier of the pattern yarn.
     * @param patternId The unique identifier of the pattern.
     * @param suggestedYarnId The unique identifier of the suggested yarn.
     * @param description The description of the yarn needed by the pattern.
     * @param weight The yarn weight needed by the pattern.
     * @param yardage The yardage needed by the pattern.
     * @param grams The weight in grams needed by the pattern.
     */
    public PatternYarn(
            int patternYarnId,
            int patternId,
            int suggestedYarnId,
            String description,
            int weight,
            int yardage,
            float grams) {
        this.patternYarnId = patternYarnId;
        this.patternId = patternId;
        this.suggestedYarnId = suggestedYarnId;
        this.description = description;
        this.weight = weight;
        this.yardage = yardage;
        this.grams = grams;
    }

    /**
     * Gets the unique identifier of the pattern yarn.
     *
     * @return The unique identifier of the pattern yarn.
     */
    public int getPatternYarnId() {
        return patternYarnId;
    }

    /**
     * Sets the unique identifier of the pattern yarn.
     *
     * @param patternYarnId The unique identifier of the pattern yarn.
     */
    public void setPatternYarnId(int patternYarnId) {
        this.patternYarnId = patternYarnId;
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
     * Gets the unique identifier of the suggested yarn.
     *
     * @return The unique identifier of the suggested yarn.
     */
    public int getSuggestedYarnId() {
        return suggestedYarnId;
    }

    /**
     * Sets the unique identifier of the suggested yarn.
     *
     * @param suggestedYarnId The unique identifier of the suggested yarn.
     */
    public void setSuggestedYarnId(int suggestedYarnId) {
        this.suggestedYarnId = suggestedYarnId;
    }

    /**
     * Gets the description of the yarn needed by the pattern.
     *
     * @return The description of the yarn needed by the pattern.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of the yarn needed by the pattern.
     *
     * @param description The description of the yarn needed by the pattern.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the yarn weight needed by the pattern.
     *
     * @return The yarn weight needed by the pattern.
     */
    public int getWeight() {
        return weight;
    }

    /**
     * Sets the yarn weight needed by the pattern.
     *
     * @param weight The yarn weight needed by the pattern.
     */
    public void setWeight(int weight) {
        this.weight = weight;
    }

    /**
     * Gets the yardage needed by the pattern.
     *
     * @return The yardage needed by the pattern.
     */
    public int getYardage() {
        return yardage;
    }

    /**
     * Sets the yardage needed by the pattern.
     *
     * @param yardage The yardage needed by the pattern.
     */
    public void setYardage(int yardage) {
        this.yardage = yardage;
    }

    /**
     * Gets the weight in grams needed by the pattern.
     *
     * @return The weight in grams needed by the pattern.
     */
    public float getGrams() {
        return grams;
    }

    /**
     * Sets the weight in grams needed by the pattern.
     *
     * @param grams The weight in grams needed by the pattern.
     */
    public void setGrams(float grams) {
        this.grams = grams;
    }
}
