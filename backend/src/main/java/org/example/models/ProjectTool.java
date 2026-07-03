package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for project tools.
 */
public class ProjectTool {
    private int projectToolId;
    private int projectId;
    private int patternToolId;
    private int stashToolId;
    private LocalDateTime createdAt;
    private LocalDateTime removedAt;

    public ProjectTool(
            int projectToolId,
            int projectId,
            int patternToolId,
            int stashToolId,
            LocalDateTime createdAt,
            LocalDateTime removedAt) {
        this.projectToolId = projectToolId;
        this.projectId = projectId;
        this.patternToolId = patternToolId;
        this.stashToolId = stashToolId;
        this.createdAt = createdAt;
        this.removedAt = removedAt;
    }

    public int getProjectToolId() {
        return projectToolId;
    }

    public void setProjectToolId(int projectToolId) {
        this.projectToolId = projectToolId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public int getPatternToolId() {
        return patternToolId;
    }

    public void setPatternToolId(int patternToolId) {
        this.patternToolId = patternToolId;
    }

    public int getStashToolId() {
        return stashToolId;
    }

    public void setStashToolId(int stashToolId) {
        this.stashToolId = stashToolId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRemovedAt() {
        return removedAt;
    }

    public void setRemovedAt(LocalDateTime removedAt) {
        this.removedAt = removedAt;
    }
}
