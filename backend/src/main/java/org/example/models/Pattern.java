package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for patterns.
 */
public class Pattern {
    /**
     * The unique identifier of the pattern.
     */
    private int patternId;

    /**
     * The username of the user who owns the pattern.
     */
    private String username;

    /**
     * The category of the pattern.
     */
    private String category;

    /**
     * The technique used by the pattern.
     */
    private String technique;

    /**
     * The name of the pattern.
     */
    private String name;

    /**
     * The designer of the pattern.
     */
    private String designer;

    /**
     * The description of the pattern.
     */
    private String description;

    /**
     * The difficulty of the pattern.
     */
    private String difficulty;

    /**
     * The link to the pattern source.
     */
    private String link;

    /**
     * The image URL of the pattern.
     */
    private String imageUrl;

    /**
     * The date and time the pattern was created.
     */
    private LocalDateTime createdAt;

    /**
     * The date and time the pattern was last updated.
     */
    private LocalDateTime updatedAt;

    /**
     * Creates a new pattern.
     *
     * @param patternId The unique identifier of the pattern.
     * @param username The username of the user who owns the pattern.
     * @param category The category of the pattern.
     * @param technique The technique used by the pattern.
     * @param name The name of the pattern.
     * @param designer The designer of the pattern.
     * @param description The description of the pattern.
     * @param difficulty The difficulty of the pattern.
     * @param link The link to the pattern.
     * @param imageUrl The image URL of the pattern.
     * @param createdAt The date and time the pattern was created.
     * @param updatedAt The date and time the pattern was last updated.
     */
    public Pattern(
            int patternId,
            String username,
            String category,
            String technique,
            String name,
            String designer,
            String description,
            String difficulty,
            String link,
            String imageUrl,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.patternId = patternId;
        this.username = username;
        this.category = category;
        this.technique = technique;
        this.name = name;
        this.designer = designer;
        this.description = description;
        this.difficulty = difficulty;
        this.link = link;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
     * Gets the username of the user who owns the pattern.
     *
     * @return The username of the user who owns the pattern.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username of the user who owns the pattern.
     *
     * @param username The username of the user who owns the pattern.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the category of the pattern.
     *
     * @return The category of the pattern.
     */
    public String getCategory() {
        return category;
    }

    /**
     * Sets the category of the pattern.
     *
     * @param category The category of the pattern.
     */
    public void setCategory(String category) {
        this.category = category;
    }

    /**
     * Gets the technique used by the pattern.
     *
     * @return The technique used by the pattern.
     */
    public String getTechnique() {
        return technique;
    }

    /**
     * Sets the technique used by the pattern.
     *
     * @param technique The technique used by the pattern.
     */
    public void setTechnique(String technique) {
        this.technique = technique;
    }

    /**
     * Gets the name of the pattern.
     *
     * @return The name of the pattern.
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the pattern.
     *
     * @param name The name of the pattern.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the designer of the pattern.
     *
     * @return The designer of the pattern.
     */
    public String getDesigner() {
        return designer;
    }

    /**
     * Sets the designer of the pattern.
     *
     * @param designer The designer of the pattern.
     */
    public void setDesigner(String designer) {
        this.designer = designer;
    }

    /**
     * Gets the description of the pattern.
     *
     * @return The description of the pattern.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of the pattern.
     *
     * @param description The description of the pattern.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the difficulty of the pattern.
     *
     * @return The difficulty of the pattern.
     */
    public String getDifficulty() {
        return difficulty;
    }

    /**
     * Sets the difficulty of the pattern.
     *
     * @param difficulty The difficulty of the pattern.
     */
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    /**
     * Gets the link to the pattern.
     *
     * @return The link to the pattern.
     */
    public String getLink() {
        return link;
    }

    /**
     * Sets the link to the pattern.
     *
     * @param link The link to the pattern.
     */
    public void setLink(String link) {
        this.link = link;
    }

    /**
     * Gets the image URL of the pattern.
     *
     * @return The image URL of the pattern.
     */
    public String getImageUrl() {
        return imageUrl;
    }

    /**
     * Sets the image URL of the pattern.
     *
     * @param imageUrl The image URL of the pattern.
     */
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    /**
     * Gets the date and time the pattern was created.
     *
     * @return The date and time the pattern was created.
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the date and time the pattern was created.
     *
     * @param createdAt The date and time the pattern was created.
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Gets the date and time the pattern was last updated.
     *
     * @return The date and time the pattern was last updated.
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets the date and time the pattern was last updated.
     *
     * @param updatedAt The date and time the pattern was last updated.
     */
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
