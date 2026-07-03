package org.example.models;

import java.time.LocalDateTime;

/**
 * Model class for photos.
 */
public class Photo {
    private int photoId;
    private int projectId;
    private Integer milestoneId;
    private String imageUrl;
    private boolean isMarquee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Photo(
            int photoId,
            int projectId,
            Integer milestoneId,
            String imageUrl,
            boolean isMarquee,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.photoId = photoId;
        this.projectId = projectId;
        this.milestoneId = milestoneId;
        this.imageUrl = imageUrl;
        this.isMarquee = isMarquee;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getPhotoId() {
        return photoId;
    }

    public void setPhotoId(int photoId) {
        this.photoId = photoId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public Integer getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(Integer milestoneId) {
        this.milestoneId = milestoneId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isMarquee() {
        return isMarquee;
    }

    public void setMarquee(boolean isMarquee) {
        this.isMarquee = isMarquee;
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
