package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for milestones.
 */
public class Milestone {
    private int milestoneId;
    private int projectId;
    private String note;
    private int rowCount;
    private int repeatCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Milestone(
            int milestoneId,
            int projectId,
            String note,
            int rowCount,
            int repeatCount,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.milestoneId = milestoneId;
        this.projectId = projectId;
        this.note = note;
        this.rowCount = rowCount;
        this.repeatCount = repeatCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(int milestoneId) {
        this.milestoneId = milestoneId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public int getRowCount() {
        return rowCount;
    }

    public void setRowCount(int rowCount) {
        this.rowCount = rowCount;
    }

    public int getRepeatCount() {
        return repeatCount;
    }

    public void setRepeatCount(int repeatCount) {
        this.repeatCount = repeatCount;
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
