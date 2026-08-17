package org.example.controllers;

import org.example.daos.PatternDao;
import org.example.daos.PatternMaterialDao;
import org.example.daos.PatternToolDao;
import org.example.daos.PatternYarnDao;
import org.example.daos.ProjectDao;
import org.example.daos.ProjectTagDao;
import org.example.daos.TagDao;
import org.example.dtos.CreateProjectDto;
import org.example.dtos.ProjectDto;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Arrays;
import java.util.LinkedHashSet;

/**
 * Controller for projects owned by the currently logged-in user.
 */
@RestController
@RequestMapping("/api/projects")
@PreAuthorize("isAuthenticated()")
public class ProjectController {
    /**
     * The project data access object.
     */
    @Autowired
    private ProjectDao projectDao;

    /**
     * The project tag data access object.
     */
    @Autowired
    private ProjectTagDao projectTagDao;

    /**
     * The tag data access object.
     */
    @Autowired
    private TagDao tagDao;

    /**
     * The pattern data access object.
     */
    @Autowired
    private PatternDao patternDao;

    /**
     * The pattern yarn data access object.
     */
    @Autowired
    private PatternYarnDao patternYarnDao;

    /**
     * The pattern tool data access object.
     */
    @Autowired
    private PatternToolDao patternToolDao;

    /**
     * The pattern material data access object.
     */
    @Autowired
    private PatternMaterialDao patternMaterialDao;

    /**
     * Gets projects owned by the currently logged-in user.
     *
     * @param principal The currently logged-in user.
     * @return The user's projects.
     */
    @GetMapping
    public List<ProjectSummaryDto> list(Principal principal) {
        return projectDao.getProjectsByUsername(principal.getName()).stream()
                .map(project -> new ProjectSummaryDto(
                        project,
                        getProjectTags(project.getProjectId())))
                .toList();
    }

    /**
     * Gets one project owned by the currently logged-in user.
     *
     * @param principal The currently logged-in user.
     * @param projectId The project id.
     * @return The project, its pattern, and the pattern resources, or a 404 if
     *         the project is not owned by the user.
     */
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDto> get(Principal principal, @PathVariable int projectId) {
        Project project = projectDao.getProjectById(projectId);

        if (project == null || !project.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        Pattern pattern = patternDao.getPatternById(project.getPatternId());

        if (pattern == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new ProjectDto(
                project,
                getProjectTags(projectId),
                pattern,
                patternYarnDao.getPatternYarnsByPatternId(pattern.getPatternId()),
                patternToolDao.getPatternToolsByPatternId(pattern.getPatternId()),
                patternMaterialDao.getPatternMaterialsByPatternId(pattern.getPatternId())));
    }

    /**
     * Creates a project owned by the currently logged-in user.
     *
     * @param principal The currently logged-in user.
     * @param request The project to create.
     * @return The created project, or a 404 if the selected pattern is not owned by the user.
     */
    @PostMapping
    @Transactional
    public ResponseEntity<Project> create(
            Principal principal,
            @RequestBody CreateProjectDto request) {
        Pattern pattern = patternDao.getPatternById(request.patternId());

        if (pattern == null || !pattern.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        Project project = request.toProject();
        project.setUsername(principal.getName());

        Project createdProject = projectDao.createProject(project);

        if (request.tags() != null) {
            for (String tagName : new LinkedHashSet<>(Arrays.asList(request.tags()))) {
                Tag tag = tagDao.getTagByUsernameAndName(principal.getName(), tagName);

                if (tag == null) {
                    tag = tagDao.createTag(new Tag(0, principal.getName(), tagName));
                }

                projectTagDao.createProjectTag(new ProjectTag(createdProject.getProjectId(), tag.getTagId()));
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    /**
     * Gets the tags assigned to a project.
     *
     * @param projectId The project id.
     * @return The project's tags.
     */
    private List<Tag> getProjectTags(int projectId) {
        return projectTagDao.getProjectTagsByProjectId(projectId).stream()
                .map(projectTag -> tagDao.getTagById(projectTag.getTagId()))
                .toList();
    }
}
