package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for yarns.
 */
public class Yarn {
    /**
     * The unique identifier of the yarn.
     */
    private int yarnId;

    /**
     * The brand of the yarn.
     */
    private String brand;

    /**
     * The colorway of the yarn.
     */
    private String colorway;

    /**
     * The color of the yarn.
     */
    private String color;

    /**
     * The weight of the yarn.
     */
    private String weight;

    /**
     * The fiber content of the yarn.
     */
    private String fiber;

    /**
     * The style of the yarn.
     */
    private String style;

    /**
     * The yardage of the yarn.
     */
    private int yardage;

    /**
     * The weight of the yarn in grams.
     */
    private float grams;

    /**
     * The image URL of the yarn.
     */
    private String imageUrl;

    /**
     * The date and time the yarn was created.
     */
    private LocalDateTime createdAt;

    /**
     * The date and time the yarn was last updated.
     */
    private LocalDateTime updatedAt;

    /**
     * Creates a new yarn.
     *
     * @param yarnId The unique identifier of the yarn.
     * @param brand The brand of the yarn.
     * @param colorway The colorway of the yarn.
     * @param color The color of the yarn.
     * @param weight The weight of the yarn.
     * @param fiber The fiber content of the yarn.
     * @param style The style of the yarn.
     * @param yardage The yardage of the yarn.
     * @param grams The weight of the yarn in grams.
     * @param imageUrl The image URL of the yarn.
     * @param createdAt The date and time the yarn was created.
     * @param updatedAt The date and time the yarn was last updated.
     */
    public Yarn(
            int yarnId,
            String brand,
            String colorway,
            String color,
            String weight,
            String fiber,
            String style,
            int yardage,
            float grams,
            String imageUrl,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.yarnId = yarnId;
        this.brand = brand;
        this.colorway = colorway;
        this.color = color;
        this.weight = weight;
        this.fiber = fiber;
        this.style = style;
        this.yardage = yardage;
        this.grams = grams;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Gets the unique identifier of the yarn.
     *
     * @return The unique identifier of the yarn.
     */
    public int getYarnId() {
        return yarnId;
    }

    /**
     * Sets the unique identifier of the yarn.
     *
     * @param yarnId The unique identifier of the yarn.
     */
    public void setYarnId(int yarnId) {
        this.yarnId = yarnId;
    }

    /**
     * Gets the brand of the yarn.
     *
     * @return The brand of the yarn.
     */
    public String getBrand() {
        return brand;
    }

    /**
     * Sets the brand of the yarn.
     *
     * @param brand The brand of the yarn.
     */
    public void setBrand(String brand) {
        this.brand = brand;
    }

    /**
     * Gets the colorway of the yarn.
     *
     * @return The colorway of the yarn.
     */
    public String getColorway() {
        return colorway;
    }

    /**
     * Sets the colorway of the yarn.
     *
     * @param colorway The colorway of the yarn.
     */
    public void setColorway(String colorway) {
        this.colorway = colorway;
    }

    /**
     * Gets the color of the yarn.
     *
     * @return The color of the yarn.
     */
    public String getColor() {
        return color;
    }

    /**
     * Sets the color of the yarn.
     *
     * @param color The color of the yarn.
     */
    public void setColor(String color) {
        this.color = color;
    }

    /**
     * Gets the weight of the yarn.
     *
     * @return The weight of the yarn.
     */
    public String getWeight() {
        return weight;
    }

    /**
     * Sets the weight of the yarn.
     *
     * @param weight The weight of the yarn.
     */
    public void setWeight(String weight) {
        this.weight = weight;
    }

    /**
     * Gets the fiber content of the yarn.
     *
     * @return The fiber content of the yarn.
     */
    public String getFiber() {
        return fiber;
    }

    /**
     * Sets the fiber content of the yarn.
     *
     * @param fiber The fiber content of the yarn.
     */
    public void setFiber(String fiber) {
        this.fiber = fiber;
    }

    /**
     * Gets the style of the yarn.
     *
     * @return The style of the yarn.
     */
    public String getStyle() {
        return style;
    }

    /**
     * Sets the style of the yarn.
     *
     * @param style The style of the yarn.
     */
    public void setStyle(String style) {
        this.style = style;
    }

    /**
     * Gets the yardage of the yarn.
     *
     * @return The yardage of the yarn.
     */
    public int getYardage() {
        return yardage;
    }

    /**
     * Sets the yardage of the yarn.
     *
     * @param yardage The yardage of the yarn.
     */
    public void setYardage(int yardage) {
        this.yardage = yardage;
    }

    /**
     * Gets the weight of the yarn in grams.
     *
     * @return The weight of the yarn in grams.
     */
    public float getGrams() {
        return grams;
    }

    /**
     * Sets the weight of the yarn in grams.
     *
     * @param grams The weight of the yarn in grams.
     */
    public void setGrams(float grams) {
        this.grams = grams;
    }

    /**
     * Gets the image URL of the yarn.
     *
     * @return The image URL of the yarn.
     */
    public String getImageUrl() {
        return imageUrl;
    }

    /**
     * Sets the image URL of the yarn.
     *
     * @param imageUrl The image URL of the yarn.
     */
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    /**
     * Gets the date and time the yarn was created.
     *
     * @return The date and time the yarn was created.
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the date and time the yarn was created.
     *
     * @param createdAt The date and time the yarn was created.
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Gets the date and time the yarn was last updated.
     *
     * @return The date and time the yarn was last updated.
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets the date and time the yarn was last updated.
     *
     * @param updatedAt The date and time the yarn was last updated.
     */
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
