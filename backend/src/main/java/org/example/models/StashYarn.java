package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for stash yarns.
 */
public class StashYarn {
    private int stashYarnId;
    private String username;
    private int yarnId;
    private String dyeLot;
    private boolean isScrap;
    private int scrapYardage;
    private int quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime removedAt;

    public StashYarn(
            int stashYarnId,
            String username,
            int yarnId,
            String dyeLot,
            boolean isScrap,
            int scrapYardage,
            int quantity,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            LocalDateTime removedAt) {
        this.stashYarnId = stashYarnId;
        this.username = username;
        this.yarnId = yarnId;
        this.dyeLot = dyeLot;
        this.isScrap = isScrap;
        this.scrapYardage = scrapYardage;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.removedAt = removedAt;
    }

    public int getStashYarnId() {
        return stashYarnId;
    }

    public void setStashYarnId(int stashYarnId) {
        this.stashYarnId = stashYarnId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getYarnId() {
        return yarnId;
    }

    public void setYarnId(int yarnId) {
        this.yarnId = yarnId;
    }

    public String getDyeLot() {
        return dyeLot;
    }

    public void setDyeLot(String dyeLot) {
        this.dyeLot = dyeLot;
    }

    public boolean isScrap() {
        return isScrap;
    }

    public void setScrap(boolean isScrap) {
        this.isScrap = isScrap;
    }

    public int getScrapYardage() {
        return scrapYardage;
    }

    public void setScrapYardage(int scrapYardage) {
        this.scrapYardage = scrapYardage;
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
