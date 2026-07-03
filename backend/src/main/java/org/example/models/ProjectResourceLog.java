package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for project resource logs.
 */
public class ProjectResourceLog {
    private int logId;
    private int projectId;
    private String resourceType;
    private int resourceId;
    private String action;
    private int quantityChanged;
    private LocalDateTime createdAt;

    public ProjectResourceLog(
            int logId,
            int projectId,
            String resourceType,
            int resourceId,
            String action,
            int quantityChanged,
            LocalDateTime createdAt) {
        this.logId = logId;
        this.projectId = projectId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.action = action;
        this.quantityChanged = quantityChanged;
        this.createdAt = createdAt;
    }

    public int getLogId() {
        return logId;
    }

    public void setLogId(int logId) {
        this.logId = logId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public int getResourceId() {
        return resourceId;
    }

    public void setResourceId(int resourceId) {
        this.resourceId = resourceId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public int getQuantityChanged() {
        return quantityChanged;
    }

    public void setQuantityChanged(int quantityChanged) {
        this.quantityChanged = quantityChanged;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
