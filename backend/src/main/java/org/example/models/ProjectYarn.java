package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for project yarns.
 */
public class ProjectYarn {
    private int projectYarnId;
    private int projectId;
    private int patternYarnId;
    private Integer stashYarnId;
    private int yardageUsed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime removedAt;

    public ProjectYarn(
            int projectYarnId,
            int projectId,
            int patternYarnId,
            int stashYarnId,
            int yardageUsed,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            LocalDateTime removedAt) {
        this.projectYarnId = projectYarnId;
        this.projectId = projectId;
        this.patternYarnId = patternYarnId;
        this.stashYarnId = stashYarnId;
        this.yardageUsed = yardageUsed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.removedAt = removedAt;
    }

    public int getProjectYarnId() {
        return projectYarnId;
    }

    public void setProjectYarnId(int projectYarnId) {
        this.projectYarnId = projectYarnId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public int getPatternYarnId() {
        return patternYarnId;
    }

    public void setPatternYarnId(int patternYarnId) {
        this.patternYarnId = patternYarnId;
    }

    public Integer getStashYarnId() {
        return stashYarnId;
    }

    public void setStashYarnId(Integer stashYarnId) {
        this.stashYarnId = stashYarnId;
    }

    public int getYardageUsed() {
        return yardageUsed;
    }

    public void setYardageUsed(int yardageUsed) {
        this.yardageUsed = yardageUsed;
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
