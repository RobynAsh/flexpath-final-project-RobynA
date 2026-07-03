package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for tools.
 */
public class Tool {
    private int toolId;
    private String toolType;
    private String brand;
    private float sizeMm;
    private String material;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Tool(
            int toolId,
            String toolType,
            String brand,
            float sizeMm,
            String material,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.toolId = toolId;
        this.toolType = toolType;
        this.brand = brand;
        this.sizeMm = sizeMm;
        this.material = material;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getToolId() {
        return toolId;
    }

    public void setToolId(int toolId) {
        this.toolId = toolId;
    }

    public String getToolType() {
        return toolType;
    }

    public void setToolType(String toolType) {
        this.toolType = toolType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public float getSizeMm() {
        return sizeMm;
    }

    public void setSizeMm(float sizeMm) {
        this.sizeMm = sizeMm;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
