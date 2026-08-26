package org.example.controllers;

import org.example.daos.MilestoneDao;
import org.example.daos.ProjectDao;
import org.example.dtos.AdminMilestoneDto;
import org.example.dtos.CreateMilestoneDto;
import org.example.models.Milestone;
import org.example.models.Project;
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
import java.util.List;

/**
 * Admin controller for managing milestones belonging to any project.
 */
@RestController
@RequestMapping("/api/admin/milestones")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminMilestoneController {
    @Autowired
    private MilestoneDao milestoneDao;

    @Autowired
    private ProjectDao projectDao;

    /**
     * Gets every milestone with its project and owner information.
     *
     * @param filterField The field to filter.
     * @param filterText The case-insensitive text to find.
     * @param sortField The field to sort.
     * @param sortDirection The sort direction.
     * @return All matching milestones.
     */
    @GetMapping("/all")
    public List<AdminMilestoneDto> list(
            @RequestParam(required = false) String filterField,
            @RequestParam(required = false) String filterText,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortDirection) {
        boolean hasFilter = filterText != null && !filterText.isBlank();
        if (hasFilter && !milestoneDao.isFilterFieldSupported(filterField)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported filterField");
        }
        if (sortField != null && !milestoneDao.isSortFieldSupported(sortField)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported sortField");
        }
        if (sortDirection != null
                && !sortDirection.equals("ascending")
                && !sortDirection.equals("descending")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported sortDirection");
        }

        List<Milestone> milestones = hasFilter || sortField != null || sortDirection != null
                ? milestoneDao.getMilestones(
                        filterField,
                        filterText,
                        sortField == null ? "createdAt" : sortField,
                        sortDirection == null ? "descending" : sortDirection)
                : milestoneDao.getMilestones();

        return milestones.stream()
                .map(this::toAdminMilestone)
                .toList();
    }

    /**
     * Creates a milestone for any existing project.
     *
     * @param request The milestone to create.
     * @return The created milestone, 400 for invalid values, or 404 for a missing project.
     */
    @PostMapping
    @Transactional
    public ResponseEntity<Milestone> create(@RequestBody CreateMilestoneDto request) {
        if (projectDao.getProjectById(request.projectId()) == null) {
            return ResponseEntity.notFound().build();
        }

        if (!isValid(request)) {
            return ResponseEntity.badRequest().build();
        }

        Milestone milestone = request.toMilestone();
        milestone.setNote(request.note().trim());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(milestoneDao.createMilestone(milestone));
    }

    /**
     * Updates any existing milestone.
     *
     * @param milestoneId The milestone id.
     * @param request The values to persist.
     * @return The updated milestone, 400 for invalid values, or 404 for missing data.
     */
    @PutMapping("/{milestoneId}")
    @Transactional
    public ResponseEntity<Milestone> update(
            @PathVariable int milestoneId,
            @RequestBody CreateMilestoneDto request) {
        if (milestoneDao.getMilestoneById(milestoneId) == null
                || projectDao.getProjectById(request.projectId()) == null) {
            return ResponseEntity.notFound().build();
        }

        if (!isValid(request)) {
            return ResponseEntity.badRequest().build();
        }

        Milestone milestone = request.toMilestone();
        milestone.setMilestoneId(milestoneId);
        milestone.setNote(request.note().trim());
        milestone.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(milestoneDao.updateMilestone(milestone));
    }

    /**
     * Deletes any milestone.
     *
     * @param milestoneId The milestone id.
     * @return A 204 response, or 404 when the milestone does not exist.
     */
    @DeleteMapping("/{milestoneId}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable int milestoneId) {
        if (milestoneDao.deleteMilestone(milestoneId) == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    private boolean isValid(CreateMilestoneDto request) {
        return request.note() != null
                && !request.note().isBlank()
                && request.rowCount() >= 0
                && request.repeatCount() >= 0;
    }

    private AdminMilestoneDto toAdminMilestone(Milestone milestone) {
        Project project = projectDao.getProjectById(milestone.getProjectId());
        return new AdminMilestoneDto(
                project.getName(),
                project.getUsername(),
                milestone);
    }
}
