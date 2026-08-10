package org.example.controllers;

import org.example.daos.PatternDao;
import org.example.daos.PatternMaterialDao;
import org.example.daos.PatternTagDao;
import org.example.daos.PatternToolDao;
import org.example.daos.PatternYarnDao;
import org.example.daos.TagDao;
import org.example.dtos.PatternDto;
import org.example.models.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
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
}
