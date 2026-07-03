package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for user logs.
 */
public class UserLog {
    private int userLogId;
    private String username;
    private String action;
    private String entityType;
    private int entityId;
    private LocalDateTime createdAt;

    public UserLog(
            int userLogId,
            String username,
            String action,
            String entityType,
            int entityId,
            LocalDateTime createdAt) {
        this.userLogId = userLogId;
        this.username = username;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.createdAt = createdAt;
    }

    public int getUserLogId() {
        return userLogId;
    }

    public void setUserLogId(int userLogId) {
        this.userLogId = userLogId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public int getEntityId() {
        return entityId;
    }

    public void setEntityId(int entityId) {
        this.entityId = entityId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
