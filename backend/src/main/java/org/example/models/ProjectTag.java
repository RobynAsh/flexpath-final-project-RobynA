package org.example.models;

/**
 * Model class for project tags.
 */
public class ProjectTag {
    private int projectId;
    private int tagId;

    public ProjectTag(int projectId, int tagId) {
        this.projectId = projectId;
        this.tagId = tagId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public int getTagId() {
        return tagId;
    }

    public void setTagId(int tagId) {
        this.tagId = tagId;
    }
}
