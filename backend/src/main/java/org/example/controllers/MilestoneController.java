package org.example.controllers;

import org.example.daos.MilestoneDao;
import org.example.daos.ProjectDao;
import org.example.dtos.CreateMilestoneDto;
import org.example.dtos.RecentMilestoneDto;
import org.example.models.Milestone;
import org.example.models.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * Controller for milestones on projects owned by the currently logged-in user.
 */
@RestController
@RequestMapping("/api/milestones")
@PreAuthorize("isAuthenticated()")
public class MilestoneController {
    /**
     * The milestone data access object.
     */
    @Autowired
    private MilestoneDao milestoneDao;

    /**
     * The project data access object.
     */
    @Autowired
    private ProjectDao projectDao;

    /**
     * Gets the three most recent milestones belonging to the current user's projects.
     *
     * @param principal The currently logged-in user.
     * @return The recent milestones, newest first.
     */
    @GetMapping("/recent")
    public List<RecentMilestoneDto> recent(Principal principal) {
        return milestoneDao.getRecentMilestonesByUsername(principal.getName());
    }

    /**
     * Creates a milestone on a project owned by the currently logged-in user.
     *
     * @param principal The currently logged-in user.
     * @param request The milestone to create.
     * @return The created milestone, a 400 for invalid milestone data, or a 404
     *         if the project is not owned by the user.
     */
    @PostMapping
    public ResponseEntity<Milestone> create(
            Principal principal,
            @RequestBody CreateMilestoneDto request) {
        Project project = projectDao.getProjectById(request.projectId());

        if (project == null || !project.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        if (request.note() == null
                || request.note().isBlank()
                || request.rowCount() < 0
                || request.repeatCount() < 0) {
            return ResponseEntity.badRequest().build();
        }

        Milestone milestone = request.toMilestone();
        milestone.setNote(request.note().trim());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(milestoneDao.createMilestone(milestone));
    }

    /**
     * Deletes a milestone from a project owned by the currently logged-in user.
     *
     * @param principal The currently logged-in user.
     * @param milestoneId The milestone to delete.
     * @return A 204 response, or a 404 if the milestone is not owned by the user.
     */
    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<Void> delete(
            Principal principal,
            @PathVariable int milestoneId) {
        Milestone milestone = milestoneDao.getMilestoneById(milestoneId);

        if (milestone == null) {
            return ResponseEntity.notFound().build();
        }

        Project project = projectDao.getProjectById(milestone.getProjectId());
        if (project == null || !project.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        milestoneDao.deleteMilestone(milestoneId);
        return ResponseEntity.noContent().build();
    }
}
