package org.example.models;

/**
 * Model class for tags.
 */
public class Tag {
    private int tagId;
    private String username;
    private String name;

    public Tag(int tagId, String username, String name) {
        this.tagId = tagId;
        this.username = username;
        this.name = name;
    }

    public int getTagId() {
        return tagId;
    }

    public void setTagId(int tagId) {
        this.tagId = tagId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
