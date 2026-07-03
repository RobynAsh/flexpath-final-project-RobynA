package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for stash tools.
 */
public class StashTool {
    private int stashToolId;
    private String username;
    private int toolId;
    private int quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime removedAt;

    public StashTool(
            int stashToolId,
            String username,
            int toolId,
            int quantity,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            LocalDateTime removedAt) {
        this.stashToolId = stashToolId;
        this.username = username;
        this.toolId = toolId;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.removedAt = removedAt;
    }

    public int getStashToolId() {
        return stashToolId;
    }

    public void setStashToolId(int stashToolId) {
        this.stashToolId = stashToolId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getToolId() {
        return toolId;
    }

    public void setToolId(int toolId) {
        this.toolId = toolId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
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

    public LocalDateTime getRemovedAt() {
        return removedAt;
    }

    public void setRemovedAt(LocalDateTime removedAt) {
        this.removedAt = removedAt;
    }
}
