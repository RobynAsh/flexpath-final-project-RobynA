package org.example.controllers;

import org.example.daos.PatternDao;
import org.example.daos.PatternMaterialDao;
import org.example.daos.PatternTagDao;
import org.example.daos.PatternToolDao;
import org.example.daos.PatternYarnDao;
import org.example.daos.TagDao;
import org.example.dtos.CreatePatternDto;
import org.example.dtos.PatternDto;
import org.example.models.Pattern;
import org.example.models.PatternMaterial;
import org.example.models.PatternTag;
import org.example.models.PatternTool;
import org.example.models.PatternYarn;
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

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * Controller for patterns owned by the currently logged in user.
 */
@RestController
@RequestMapping("/api/patterns")
@PreAuthorize("isAuthenticated()")
public class PatternController {
    /**
     * The pattern data access object.
     */
    @Autowired
    private PatternDao patternDao;

    /**
     * The tag data access object.
     */
    @Autowired
    private TagDao tagDao;

    /**
     * The pattern tag data access object.
     */
    @Autowired
    private PatternTagDao patternTagDao;

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
     * Gets patterns owned by the currently logged in user.
     *
     * @param principal The currently logged in user.
     * @param limit The optional maximum number of patterns to return.
     * @return The user's patterns with their associated resources.
     */
    @GetMapping
    public List<PatternDto> list(
            Principal principal,
            @RequestParam(required = false) Integer limit) {
        if (limit != null && limit < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "limit must be greater than or equal to zero");
        }

        List<Pattern> patterns = limit == null
                ? patternDao.getPatternsByUsername(principal.getName())
                : patternDao.getPatternsByUsername(principal.getName(), limit);

        return patterns.stream()
                .map(pattern -> new PatternDto(
                        pattern,
                        patternTagDao.getPatternTagsByPatternId(pattern.getPatternId()).stream()
                                .map(patternTag -> tagDao.getTagById(patternTag.getTagId()))
                                .toList(),
                        patternYarnDao.getPatternYarnsByPatternId(pattern.getPatternId()),
                        patternToolDao.getPatternToolsByPatternId(pattern.getPatternId()),
                        patternMaterialDao.getPatternMaterialsByPatternId(pattern.getPatternId())))
                .toList();
    }

    /**
     * Gets one pattern owned by the currently logged in user.
     *
     * @param principal The currently logged in user.
     * @param patternId The pattern id.
     * @return The pattern and its associated resources, or a 404 if it is not owned by the user.
     */
    @GetMapping("/{patternId}")
    public ResponseEntity<PatternDto> get(Principal principal, @PathVariable int patternId) {
        Pattern pattern = patternDao.getPatternById(patternId);

        if (pattern == null || !pattern.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new PatternDto(
                pattern,
                patternTagDao.getPatternTagsByPatternId(patternId).stream()
                        .map(patternTag -> tagDao.getTagById(patternTag.getTagId()))
                        .toList(),
                patternYarnDao.getPatternYarnsByPatternId(patternId),
                patternToolDao.getPatternToolsByPatternId(patternId),
                patternMaterialDao.getPatternMaterialsByPatternId(patternId)));
    }

    /**
     * Creates a pattern owned by the currently logged in user.
     *
     * @param principal The currently logged in user.
     * @param request The pattern and its associated resource requirements.
     * @return The created pattern.
     */
    @PostMapping
    @Transactional
    public ResponseEntity<Pattern> create(
            Principal principal,
            @RequestBody CreatePatternDto request) {
        Pattern requestedPattern = request.toPattern();
        requestedPattern.setUsername(principal.getName());
        Pattern pattern = patternDao.createPattern(requestedPattern);

        if (request.tags() != null) {
            for (String tagName : new LinkedHashSet<>(Arrays.asList(request.tags()))) {
                Tag tag = tagDao.getTagByUsernameAndName(pattern.getUsername(), tagName);

                if (tag == null) {
                    tag = tagDao.createTag(new Tag(0, pattern.getUsername(), tagName));
                }

                patternTagDao.createPatternTag(new PatternTag(pattern.getPatternId(), tag.getTagId()));
            }
        }

        if (request.yarn() != null) {
            for (PatternYarn yarn : request.yarn()) {
                patternYarnDao.createPatternYarn(new PatternYarn(
                        0,
                        pattern.getPatternId(),
                        yarn.getDescription(),
                        yarn.getWeight(),
                        yarn.getYardage(),
                        yarn.getGrams()));
            }
        }

        if (request.tools() != null) {
            for (PatternTool tool : request.tools()) {
                patternToolDao.createPatternTool(new PatternTool(
                        0,
                        pattern.getPatternId(),
                        tool.getToolType(),
                        tool.getSizeMm()));
            }
        }

        if (request.materials() != null) {
            for (PatternMaterial material : request.materials()) {
                patternMaterialDao.createPatternMaterial(new PatternMaterial(
                        0,
                        pattern.getPatternId(),
                        material.getName(),
                        material.getDescription(),
                        material.getQuantity(),
                        null,
                        null));
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(pattern);
    }

    /**
     * Updates a pattern owned by the currently logged in user and replaces its
     * associated resources.
     *
     * @param principal The currently logged in user.
     * @param patternId The pattern id.
     * @param request The pattern and its associated resource requirements.
     * @return The updated pattern, or a 404 if it is not owned by the user.
     */
    @PutMapping("/{patternId}")
    @Transactional
    public ResponseEntity<Pattern> update(
            Principal principal,
            @PathVariable int patternId,
            @RequestBody CreatePatternDto request) {
        Pattern existingPattern = patternDao.getPatternById(patternId);

        if (existingPattern == null || !existingPattern.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        Pattern requestedPattern = request.toPattern();
        requestedPattern.setPatternId(patternId);
        requestedPattern.setUsername(principal.getName());
        requestedPattern.setUpdatedAt(LocalDateTime.now());
        Pattern pattern = patternDao.updatePattern(requestedPattern);

        patternTagDao.getPatternTagsByPatternId(patternId)
                .forEach(patternTag ->
                        patternTagDao.deletePatternTag(patternId, patternTag.getTagId()));
        patternYarnDao.getPatternYarnsByPatternId(patternId)
                .forEach(yarn -> patternYarnDao.deletePatternYarn(yarn.getPatternYarnId()));
        patternToolDao.getPatternToolsByPatternId(patternId)
                .forEach(tool -> patternToolDao.deletePatternTool(tool.getPatternToolId()));
        patternMaterialDao.getPatternMaterialsByPatternId(patternId)
                .forEach(material ->
                        patternMaterialDao.deletePatternMaterial(material.getPatternMaterialId()));

        if (request.tags() != null) {
            for (String tagName : new LinkedHashSet<>(Arrays.asList(request.tags()))) {
                Tag tag = tagDao.getTagByUsernameAndName(principal.getName(), tagName);

                if (tag == null) {
                    tag = tagDao.createTag(new Tag(0, principal.getName(), tagName));
                }

                patternTagDao.createPatternTag(new PatternTag(patternId, tag.getTagId()));
            }
        }

        if (request.yarn() != null) {
            for (PatternYarn yarn : request.yarn()) {
                patternYarnDao.createPatternYarn(new PatternYarn(
                        0,
                        patternId,
                        yarn.getDescription(),
                        yarn.getWeight(),
                        yarn.getYardage(),
                        yarn.getGrams()));
            }
        }

        if (request.tools() != null) {
            for (PatternTool tool : request.tools()) {
                patternToolDao.createPatternTool(new PatternTool(
                        0,
                        patternId,
                        tool.getToolType(),
                        tool.getSizeMm()));
            }
        }

        if (request.materials() != null) {
            for (PatternMaterial material : request.materials()) {
                patternMaterialDao.createPatternMaterial(new PatternMaterial(
                        0,
                        patternId,
                        material.getName(),
                        material.getDescription(),
                        material.getQuantity(),
                        null,
                        null));
            }
        }

        return ResponseEntity.ok(pattern);
    }

    /**
     * Deletes a pattern owned by the currently logged in user.
     *
     * @param principal The currently logged in user.
     * @param patternId The pattern id.
     * @return A 204 response, or a 404 if the pattern is not owned by the user.
     */
    @DeleteMapping("/{patternId}")
    @Transactional
    public ResponseEntity<Void> delete(Principal principal, @PathVariable int patternId) {
        Pattern pattern = patternDao.getPatternById(patternId);

        if (pattern == null || !pattern.getUsername().equals(principal.getName())) {
            return ResponseEntity.notFound().build();
        }

        patternDao.deletePattern(patternId);
        return ResponseEntity.noContent().build();
    }
}
