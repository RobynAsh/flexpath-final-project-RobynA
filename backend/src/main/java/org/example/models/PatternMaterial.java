package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for pattern materials.
 */
public class PatternMaterial {
    /**
     * The unique identifier of the pattern material.
     */
    private int patternMaterialId;

    /**
     * The unique identifier of the pattern.
     */
    private int patternId;

    /**
     * The name of the material.
     */
    private String name;

    /**
     * The description of the material.
     */
    private String description;

    /**
     * The quantity of the material needed by the pattern.
     */
    private int quantity;

    /**
     * The date and time the pattern material was created.
     */
    private LocalDateTime createdAt;

    /**
     * The date and time the pattern material was last updated.
     */
    private LocalDateTime updatedAt;

    /**
     * Creates a new pattern material.
     *
     * @param patternMaterialId The unique identifier of the pattern material.
     * @param patternId The unique identifier of the pattern.
     * @param name The name of the material.
     * @param description The description of the material.
     * @param quantity The quantity of the material needed by the pattern.
     * @param createdAt The date and time the pattern material was created.
     * @param updatedAt The date and time the pattern material was last updated.
     */
    public PatternMaterial(
            int patternMaterialId,
            int patternId,
            String name,
            String description,
            int quantity,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.patternMaterialId = patternMaterialId;
        this.patternId = patternId;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Gets the unique identifier of the pattern material.
     *
     * @return The unique identifier of the pattern material.
     */
    public int getPatternMaterialId() {
        return patternMaterialId;
    }

    /**
     * Sets the unique identifier of the pattern material.
     *
     * @param patternMaterialId The unique identifier of the pattern material.
     */
    public void setPatternMaterialId(int patternMaterialId) {
        this.patternMaterialId = patternMaterialId;
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
     * Gets the name of the material.
     *
     * @return The name of the material.
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the material.
     *
     * @param name The name of the material.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the description of the material.
     *
     * @return The description of the material.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of the material.
     *
     * @param description The description of the material.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the quantity of the material needed by the pattern.
     *
     * @return The quantity of the material needed by the pattern.
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * Sets the quantity of the material needed by the pattern.
     *
     * @param quantity The quantity of the material needed by the pattern.
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * Gets the date and time the pattern material was created.
     *
     * @return The date and time the pattern material was created.
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the date and time the pattern material was created.
     *
     * @param createdAt The date and time the pattern material was created.
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Gets the date and time the pattern material was last updated.
     *
     * @return The date and time the pattern material was last updated.
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets the date and time the pattern material was last updated.
     *
     * @param updatedAt The date and time the pattern material was last updated.
     */
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
