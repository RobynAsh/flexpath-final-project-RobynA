package org.example.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Model class for projects.
 */
public class Project {
    private int projectId;
    private String username;
    private int patternId;
    private String name;
    private String status;
    private boolean isPublic;
    private String care;
    private String gauge;
    private LocalDate dateStarted;
    private LocalDate dateFinished;
    private LocalDate dateNeededBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Project(
            int projectId,
            String username,
            int patternId,
            String name,
            String status,
            boolean isPublic,
            String care,
            String gauge,
            LocalDate dateStarted,
            LocalDate dateFinished,
            LocalDate dateNeededBy,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.projectId = projectId;
        this.username = username;
        this.patternId = patternId;
        this.name = name;
        this.status = status;
        this.isPublic = isPublic;
        this.care = care;
        this.gauge = gauge;
        this.dateStarted = dateStarted;
        this.dateFinished = dateFinished;
        this.dateNeededBy = dateNeededBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getPatternId() {
        return patternId;
    }

    public void setPatternId(int patternId) {
        this.patternId = patternId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getCare() {
        return care;
    }

    public void setCare(String care) {
        this.care = care;
    }

    public String getGauge() {
        return gauge;
    }

    public void setGauge(String gauge) {
        this.gauge = gauge;
    }

    public LocalDate getDateStarted() {
        return dateStarted;
    }

    public void setDateStarted(LocalDate dateStarted) {
        this.dateStarted = dateStarted;
    }

    public LocalDate getDateFinished() {
        return dateFinished;
    }

    public void setDateFinished(LocalDate dateFinished) {
        this.dateFinished = dateFinished;
    }

    public LocalDate getDateNeededBy() {
        return dateNeededBy;
    }

    public void setDateNeededBy(LocalDate dateNeededBy) {
        this.dateNeededBy = dateNeededBy;
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
