package org.example.controllers;

import org.example.daos.PatternDao;
import org.example.daos.ProjectDao;
import org.example.daos.ProjectTagDao;
import org.example.daos.TagDao;
import org.example.dtos.CreateAdminProjectDto;
import org.example.dtos.ProjectSummaryDto;
import org.example.models.Pattern;
import org.example.models.Project;
import org.example.models.ProjectTag;
import org.example.models.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * Admin controller for managing projects belonging to any user.
 */
@RestController
@RequestMapping("/api/admin/projects")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminProjectController {
    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private ProjectTagDao projectTagDao;

    @Autowired
    private TagDao tagDao;

    @Autowired
    private PatternDao patternDao;

    /**
     * Gets every project and its tags.
     *
     * @param filterField The field to filter.
     * @param filterText The case-insensitive text to find.
     * @param sortField The field to sort.
     * @param sortDirection The sort direction.
     * @return All projects.
     */
    @GetMapping("/all")
    public List<ProjectSummaryDto> list(
            @RequestParam(required = false) String filterField,
            @RequestParam(required = false) String filterText,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortDirection) {
        boolean hasFilter = filterText != null && !filterText.isBlank();
        if (hasFilter && !projectDao.isFilterFieldSupported(filterField)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported filterField");
        }
        if (sortField != null && !projectDao.isSortFieldSupported(sortField)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported sortField");
        }
        if (sortDirection != null
                && !sortDirection.equals("ascending")
                && !sortDirection.equals("descending")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported sortDirection");
        }

        List<Project> projects = hasFilter || sortField != null || sortDirection != null
                ? projectDao.getProjects(
                        filterField,
                        filterText,
                        sortField == null ? "updatedAt" : sortField,
                        sortDirection == null ? "descending" : sortDirection)
                : projectDao.getProjects();

        return projects.stream()
                .map(project -> new ProjectSummaryDto(
                        project,
                        getProjectTags(project.getProjectId())))
                .toList();
    }

    /**
     * Creates a project for the requested user.
     *
     * @param request The project to create.
     * @return The created project, or 404 when the selected pattern does not belong to the user.
     */
    @PostMapping
    @Transactional
    public ResponseEntity<Project> create(@RequestBody CreateAdminProjectDto request) {
        if (!isOwnedPattern(request.patternId(), request.username())) {
            return ResponseEntity.notFound().build();
        }

        Project project = projectDao.createProject(request.toProject());
        replaceTags(project.getProjectId(), request.username(), request.tags());
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    /**
     * Updates a project and replaces its tags.
     *
     * @param projectId The project id.
     * @param request The project values to persist.
     * @return The updated project, or 404 when it or its selected pattern is unavailable.
     */
    @PutMapping("/{projectId}")
    @Transactional
    public ResponseEntity<Project> update(
            @PathVariable int projectId,
            @RequestBody CreateAdminProjectDto request) {
        if (projectDao.getProjectById(projectId) == null
                || !isOwnedPattern(request.patternId(), request.username())) {
            return ResponseEntity.notFound().build();
        }

        Project project = request.toProject();
        project.setProjectId(projectId);
        project.setUpdatedAt(LocalDateTime.now());
        Project updatedProject = projectDao.updateProject(project);
        replaceTags(projectId, request.username(), request.tags());
        return ResponseEntity.ok(updatedProject);
    }

    /**
     * Deletes any project.
     *
     * @param projectId The project id.
     * @return A 204 response, or 404 when the project does not exist.
     */
    @DeleteMapping("/{projectId}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable int projectId) {
        if (projectDao.deleteProject(projectId) == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    private boolean isOwnedPattern(int patternId, String username) {
        Pattern pattern = patternDao.getPatternById(patternId);
        return pattern != null && username != null && username.equals(pattern.getUsername());
    }

    private List<Tag> getProjectTags(int projectId) {
        return projectTagDao.getProjectTagsByProjectId(projectId).stream()
                .map(projectTag -> tagDao.getTagById(projectTag.getTagId()))
                .toList();
    }

    private void replaceTags(int projectId, String username, String[] tagNames) {
        projectTagDao.getProjectTagsByProjectId(projectId)
                .forEach(projectTag ->
                        projectTagDao.deleteProjectTag(projectId, projectTag.getTagId()));

        if (tagNames == null) {
            return;
        }

        for (String tagName : new LinkedHashSet<>(Arrays.asList(tagNames))) {
            Tag tag = tagDao.getTagByUsernameAndName(username, tagName);

            if (tag == null) {
                tag = tagDao.createTag(new Tag(0, username, tagName));
            }

            projectTagDao.createProjectTag(new ProjectTag(projectId, tag.getTagId()));
        }
    }
}
