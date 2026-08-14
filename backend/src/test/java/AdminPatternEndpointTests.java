import org.example.SpringBootApplication;
import org.example.dtos.CreatePatternDto;
import org.example.dtos.PatternDto;
import org.example.models.Pattern;
import org.example.models.PatternMaterial;
import org.example.models.PatternTool;
import org.example.models.PatternYarn;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import support.FinalTestConfiguration;
import support.WebStoreTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests for the pattern endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class AdminPatternEndpointTests extends WebStoreTest {
    /**
     * Tests that listing patterns fails if not authorized.
     */
    @Test
    @DisplayName("GET /api/admin/patterns/all should return a 401 if not authorized")
    public void listPatternsShouldFailIfNotAuthorized() {
        var result = this.restTemplate.getForEntity(
                getBaseUrl() + "/api/admin/patterns/all",
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that listing patterns returns each pattern and its associated resources.
     */
    @Test
    @DisplayName("GET /api/admin/patterns/all should return patterns with their associated resources")
    public void listPatternsShouldReturnAssociatedResources() throws Exception {
        executeSql("INSERT INTO flexpath_final.patterns "
                + "(username, category, technique, name) VALUES "
                + "('test-admin', 'Sweater', 'Crochet', 'Listed Pattern');");
        executeSql("INSERT INTO flexpath_final.tags (username, name) "
                + "VALUES ('test-admin', 'cozy');");
        executeSql("INSERT INTO flexpath_final.pattern_tags (pattern_id, tag_id) "
                + "SELECT p.pattern_id, t.tag_id FROM flexpath_final.patterns p "
                + "JOIN flexpath_final.tags t ON t.username = p.username "
                + "WHERE p.name = 'Listed Pattern' AND t.name = 'cozy';");
        executeSql("INSERT INTO flexpath_final.pattern_yarns "
                + "(pattern_id, description, weight, yardage, grams) "
                + "SELECT pattern_id, 'Body', 4, 251, 142 FROM flexpath_final.patterns "
                + "WHERE name = 'Listed Pattern';");
        executeSql("INSERT INTO flexpath_final.pattern_tools (pattern_id, tool_type, size_mm) "
                + "SELECT pattern_id, 'Crochet hook', 5.5 FROM flexpath_final.patterns "
                + "WHERE name = 'Listed Pattern';");
        executeSql("INSERT INTO flexpath_final.pattern_materials "
                + "(pattern_id, name, description, quantity) "
                + "SELECT pattern_id, 'Buttons', 'Wooden buttons', 6 FROM flexpath_final.patterns "
                + "WHERE name = 'Listed Pattern';");

        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns/all",
                HttpMethod.GET,
                GetAuthEntity("test-admin", "admin"),
                PatternDto[].class);
        var patterns = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(patterns);
        assertEquals(1, patterns.length);
        assertEquals("Listed Pattern", patterns[0].pattern().getName());
        assertEquals("cozy", patterns[0].tags().get(0).getName());
        assertEquals("Body", patterns[0].yarn().get(0).getDescription());
        assertEquals("Crochet hook", patterns[0].tools().get(0).getToolType());
        assertEquals("Buttons", patterns[0].materials().get(0).getName());
    }

    /**
     * Tests that creating a pattern fails if not authorized.
     */
    @Test
    @DisplayName("POST /api/admin/patterns should return a 401 if not authorized")
    public void createPatternShouldFailIfNotAuthorized() {
        var result = this.restTemplate.postForEntity(
                getBaseUrl() + "/api/admin/patterns",
                createPattern(),
                String.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that creating a pattern fails for an authenticated non-admin user.
     */
    @Test
    @DisplayName("POST /api/admin/patterns should return a 403 for a non-admin")
    public void createPatternShouldFailForNonAdmin() throws Exception {
        executeSql("INSERT INTO flexpath_final.users (username, password) "
                + "VALUES ('user', 'user');");

        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                GetAuthEntity("user", "user", createPattern()),
                String.class
        );

        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
    }

    /**
     * Tests that creating a pattern succeeds if authorized.
     */
    @Test
    @DisplayName("POST /api/admin/patterns should return a 201 and the created pattern for an admin")
    public void createPatternShouldSucceedIfAuthorized() {
        var requestEntity = GetAuthEntity("test-admin", "admin", createPattern());
        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                requestEntity,
                Pattern.class
        );
        var createdPattern = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(createdPattern);
        assertEquals("test-admin", createdPattern.getUsername());
        assertEquals("Sweater", createdPattern.getCategory());
        assertEquals("Crochet", createdPattern.getTechnique());
        assertEquals("Test Pattern", createdPattern.getName());
        assertEquals("Test Designer", createdPattern.getDesigner());
        assertEquals("A pattern created by an endpoint test.", createdPattern.getDescription());
        assertEquals("Beginner", createdPattern.getDifficulty());
        assertEquals("https://example.com/pattern", createdPattern.getLink());
        assertEquals("https://example.com/pattern.jpg", createdPattern.getImageUrl());
    }

    /**
     * Tests that creating a pattern reuses existing tags owned by the pattern's
     * user and creates any tags that do not yet exist.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("POST /api/admin/patterns should reuse and create tags for the pattern owner")
    public void createPatternShouldAssignExistingAndNewTagsToPatternOwner() throws Exception {
        var request = new CreatePatternDto(
                "pattern-owner",
                "Sweater",
                "Crochet",
                "Tagged Pattern",
                "Test Designer",
                "A tagged pattern created by an endpoint test.",
                "Beginner",
                "https://example.com/tagged-pattern",
                "https://example.com/tagged-pattern.jpg",
                new String[] {"cozy", "winter"},
                null,
                null,
                null);
        var requestEntity = GetAuthEntity("test-admin", "admin", request);

        executeSql("INSERT INTO flexpath_final.users (username, password) "
                + "VALUES ('pattern-owner', 'password');");
        executeSql("INSERT INTO flexpath_final.tags (username, name) "
                + "VALUES ('pattern-owner', 'cozy');");

        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                requestEntity,
                Pattern.class);
        var createdPattern = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(createdPattern);
        assertEquals("pattern-owner", createdPattern.getUsername());

        var jdbcTemplate = getJdbcTemplate();
        assertEquals(
                2,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.tags WHERE username = ?;",
                        Integer.class,
                        "pattern-owner"));
        assertEquals(
                0,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.tags WHERE username = ?;",
                        Integer.class,
                        "test-admin"));
        assertEquals(
                2,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_tags WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_tags pt "
                                + "JOIN flexpath_final.tags t ON t.tag_id = pt.tag_id "
                                + "WHERE pt.pattern_id = ? AND t.username = ? AND t.name = ?;",
                        Integer.class,
                        createdPattern.getPatternId(),
                        "pattern-owner",
                        "cozy"));
    }

    /**
     * Tests that creating a pattern creates each submitted yarn requirement for
     * the newly created pattern.
     */
    @Test
    @DisplayName("POST /api/admin/patterns should create yarn requirements for the pattern")
    public void createPatternShouldCreateYarnRequirements() {
        var yarn = new PatternYarn[] {
                new PatternYarn(0, 999, "Body", 4, 251, 142),
                new PatternYarn(0, 999, "Trim", 3, 75, 50)
        };
        var request = new CreatePatternDto(
                "test-admin",
                "Sweater",
                "Crochet",
                "Pattern With Yarn",
                "Test Designer",
                "A pattern with yarn requirements.",
                "Beginner",
                "https://example.com/pattern-with-yarn",
                "https://example.com/pattern-with-yarn.jpg",
                null,
                yarn,
                null,
                null);
        var requestEntity = GetAuthEntity("test-admin", "admin", request);

        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                requestEntity,
                Pattern.class);
        var createdPattern = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(createdPattern);

        var jdbcTemplate = getJdbcTemplate();
        assertEquals(
                2,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_yarns WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_yarns "
                                + "WHERE pattern_id = ? AND description = ? AND weight = ? "
                                + "AND yardage = ? AND grams = ?;",
                        Integer.class,
                        createdPattern.getPatternId(),
                        "Body",
                        4,
                        251,
                        142));
    }

    /**
     * Tests that creating a pattern creates each submitted tool requirement for
     * the newly created pattern.
     */
    @Test
    @DisplayName("POST /api/admin/patterns should create tool requirements for the pattern")
    public void createPatternShouldCreateToolRequirements() {
        var tools = new PatternTool[] {
                new PatternTool(0, 999, "Crochet hook", 5.5f),
                new PatternTool(0, 999, "Tapestry needle", 2.25f)
        };
        var request = new CreatePatternDto(
                "test-admin",
                "Sweater",
                "Crochet",
                "Pattern With Tools",
                "Test Designer",
                "A pattern with tool requirements.",
                "Beginner",
                "https://example.com/pattern-with-tools",
                "https://example.com/pattern-with-tools.jpg",
                null,
                null,
                tools,
                null);
        var requestEntity = GetAuthEntity("test-admin", "admin", request);

        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                requestEntity,
                Pattern.class);
        var createdPattern = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(createdPattern);

        var jdbcTemplate = getJdbcTemplate();
        assertEquals(
                2,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_tools WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_tools "
                                + "WHERE pattern_id = ? AND tool_type = ? AND size_mm = ?;",
                        Integer.class,
                        createdPattern.getPatternId(),
                        "Crochet hook",
                        5.5f));
    }

    /**
     * Tests that creating a pattern creates each submitted material requirement
     * for the newly created pattern.
     */
    @Test
    @DisplayName("POST /api/admin/patterns should create material requirements for the pattern")
    public void createPatternShouldCreateMaterialRequirements() {
        var materials = new PatternMaterial[] {
                new PatternMaterial(0, 999, "Buttons", "Wooden buttons", 6, null, null),
                new PatternMaterial(0, 999, "Zipper", "Separating zipper", 1, null, null)
        };
        var request = new CreatePatternDto(
                "test-admin",
                "Sweater",
                "Crochet",
                "Pattern With Materials",
                "Test Designer",
                "A pattern with material requirements.",
                "Beginner",
                "https://example.com/pattern-with-materials",
                "https://example.com/pattern-with-materials.jpg",
                null,
                null,
                null,
                materials);
        var requestEntity = GetAuthEntity("test-admin", "admin", request);

        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                requestEntity,
                Pattern.class);
        var createdPattern = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(createdPattern);

        var jdbcTemplate = getJdbcTemplate();
        assertEquals(
                2,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_materials WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_materials "
                                + "WHERE pattern_id = ? AND name = ? AND description = ? AND quantity = ?;",
                        Integer.class,
                        createdPattern.getPatternId(),
                        "Buttons",
                        "Wooden buttons",
                        6));
    }

    /**
     * Tests that updating a pattern replaces its details and associated resources.
     */
    @Test
    @DisplayName("PUT /api/admin/patterns/{patternId} should update the pattern and replace its resources")
    public void updatePatternShouldReplacePatternAndResources() {
        var original = new CreatePatternDto(
                "test-admin",
                "Sweater",
                "Crochet",
                "Original Pattern",
                "Original Designer",
                "Original description",
                "Beginner",
                "https://example.com/original",
                null,
                new String[] {"old-tag"},
                new PatternYarn[] {
                        new PatternYarn(0, 0, "Old yarn", 3, 100, 50)
                },
                new PatternTool[] {
                        new PatternTool(0, 0, "Old hook", 4.0f)
                },
                new PatternMaterial[] {
                        new PatternMaterial(0, 0, "Old material", null, 1, null, null)
                });
        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                GetAuthEntity("test-admin", "admin", original),
                Pattern.class);
        var createdPattern = createResult.getBody();
        assertNotNull(createdPattern);

        var update = new CreatePatternDto(
                "test-admin",
                "Accessory",
                "Knitting",
                "Updated Pattern",
                "Updated Designer",
                "Updated description",
                "Intermediate",
                "https://example.com/updated",
                "https://example.com/updated.jpg",
                new String[] {"new-tag"},
                new PatternYarn[] {
                        new PatternYarn(0, 0, "New yarn", 4, 250, 100)
                },
                new PatternTool[] {
                        new PatternTool(0, 0, "New needles", 5.5f)
                },
                new PatternMaterial[] {
                        new PatternMaterial(0, 0, "New material", "Updated", 2, null, null)
                });
        var updateResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns/" + createdPattern.getPatternId(),
                HttpMethod.PUT,
                GetAuthEntity("test-admin", "admin", update),
                Pattern.class);

        assertEquals(HttpStatus.OK, updateResult.getStatusCode());
        assertNotNull(updateResult.getBody());
        assertEquals("Updated Pattern", updateResult.getBody().getName());

        var jdbcTemplate = getJdbcTemplate();
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_yarns "
                                + "WHERE pattern_id = ? AND description = 'New yarn';",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                0,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_yarns "
                                + "WHERE pattern_id = ? AND description = 'Old yarn';",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_tags pt "
                                + "JOIN flexpath_final.tags t ON t.tag_id = pt.tag_id "
                                + "WHERE pt.pattern_id = ? AND t.name = 'new-tag';",
                        Integer.class,
                        createdPattern.getPatternId()));
    }

    /**
     * Tests that updating only associated resources still updates the pattern timestamp.
     */
    @Test
    @DisplayName("PUT /api/admin/patterns/{patternId} should update updatedAt for resource-only changes")
    public void updatePatternShouldUpdateTimestampForResourceOnlyChanges() throws Exception {
        var request = new CreatePatternDto(
                "test-admin",
                "Sweater",
                "Crochet",
                "Timestamp Pattern",
                "Test Designer",
                "Original description",
                "Beginner",
                "https://example.com/timestamp",
                null,
                new String[] {"old-tag"},
                null,
                null,
                null);
        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                GetAuthEntity("test-admin", "admin", request),
                Pattern.class);
        var createdPattern = createResult.getBody();
        assertNotNull(createdPattern);

        var previousUpdatedAt = LocalDateTime.of(2000, 1, 1, 0, 0);
        getJdbcTemplate().update(
                "UPDATE flexpath_final.patterns SET updated_at = ? WHERE pattern_id = ?;",
                previousUpdatedAt,
                createdPattern.getPatternId());

        var resourceOnlyUpdate = new CreatePatternDto(
                request.username(),
                request.category(),
                request.technique(),
                request.name(),
                request.designer(),
                request.description(),
                request.difficulty(),
                request.link(),
                request.imageUrl(),
                new String[] {"new-tag"},
                request.yarn(),
                request.tools(),
                request.materials());
        var updateResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns/" + createdPattern.getPatternId(),
                HttpMethod.PUT,
                GetAuthEntity("test-admin", "admin", resourceOnlyUpdate),
                Pattern.class);

        assertEquals(HttpStatus.OK, updateResult.getStatusCode());
        assertNotNull(updateResult.getBody());
        assertTrue(updateResult.getBody().getUpdatedAt().isAfter(previousUpdatedAt));
    }

    /**
     * Tests that deleting a pattern requires authentication.
     */
    @Test
    @DisplayName("DELETE /api/admin/patterns/{patternId} should return a 401 if not authorized")
    public void deletePatternShouldFailIfNotAuthorized() {
        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns/1",
                HttpMethod.DELETE,
                null,
                Void.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that an administrator can delete a pattern and its related data.
     */
    @Test
    @DisplayName("DELETE /api/admin/patterns/{patternId} should delete the pattern for an admin")
    public void deletePatternShouldSucceedIfAuthorized() {
        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns",
                HttpMethod.POST,
                GetAuthEntity("test-admin", "admin", createPattern()),
                Pattern.class);
        var createdPattern = createResult.getBody();
        assertNotNull(createdPattern);

        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/admin/patterns/" + createdPattern.getPatternId(),
                HttpMethod.DELETE,
                GetAuthEntity("test-admin", "admin"),
                Void.class);

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertEquals(
                0,
                getJdbcTemplate().queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.patterns WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
    }

    /**
     * Creates a pattern for use in endpoint requests.
     *
     * @return The pattern.
     */
    private Pattern createPattern() {
        return new Pattern(
                0,
                "test-admin",
                "Sweater",
                "Crochet",
                "Test Pattern",
                "Test Designer",
                "A pattern created by an endpoint test.",
                "Beginner",
                "https://example.com/pattern",
                "https://example.com/pattern.jpg",
                null,
                null
        );
    }
}
