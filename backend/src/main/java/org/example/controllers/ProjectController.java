package org.example.controllers;

import org.example.daos.PatternDao;
import org.example.daos.PatternMaterialDao;
import org.example.daos.PatternToolDao;
import org.example.daos.PatternYarnDao;
import org.example.daos.ProjectDao;
import org.example.dtos.CreateProjectDto;
import org.example.dtos.ProjectDto;
import org.example.models.Pattern;
import org.example.models.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

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
    public List<Project> list(Principal principal) {
        return projectDao.getProjectsByUsername(principal.getName());
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
    public ResponseEntity<Project> create(
            Principal principal,
            @RequestBody CreateProjectDto request) {
        Pattern pattern = patternDao.getPatternById(request.patternId());

        if (pattern == null || !pattern.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        Project project = request.toProject();
        project.setUsername(principal.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(projectDao.createProject(project));
    }
}
