package org.example.models;

/**
 * Model class for project materials.
 */
public class ProjectMaterial {
    private int patternMaterialId;
    private int projectId;

    public ProjectMaterial(int patternMaterialId, int projectId) {
        this.patternMaterialId = patternMaterialId;
        this.projectId = projectId;
    }

    public int getPatternMaterialId() {
        return patternMaterialId;
    }

    public void setPatternMaterialId(int patternMaterialId) {
        this.patternMaterialId = patternMaterialId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }
}
