package org.example.controllers;

import org.example.daos.PatternDao;
import org.example.models.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
     * Creates a new pattern.
     *
     * @param pattern The pattern to create.
     * @return The created pattern.
     */
    @PostMapping
    public ResponseEntity<Pattern> create(@RequestBody Pattern pattern) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patternDao.createPattern(pattern));
    }
}
