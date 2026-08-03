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
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * Controller for patterns.
 * This class is responsible for handling HTTP requests related to patterns.
 */
@RestController
@CrossOrigin
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
     * Gets all patterns and their associated resources.
     *
     * @return The patterns with their tags, yarn, tools, and materials.
     */
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<PatternDto> list() {
        return patternDao.getPatterns().stream()
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
     * Creates a new pattern.
     *
     * @param request The pattern, tags, yarn, tool, and material requirements to create.
     * @return The created pattern.
     */
    @PostMapping
    @Transactional
    public ResponseEntity<Pattern> create(@RequestBody CreatePatternDto request) {
        Pattern pattern = patternDao.createPattern(request.toPattern());

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
                        yarn.getSuggestedYarnId(),
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
}
