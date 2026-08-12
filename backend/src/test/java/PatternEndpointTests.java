import org.example.SpringBootApplication;
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

import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Tests for the authenticated user's pattern endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class PatternEndpointTests extends WebStoreTest {
    /**
     * Tests that listing patterns requires authentication.
     */
    @Test
    @DisplayName("GET /api/patterns should return a 401 if not authenticated")
    public void listPatternsShouldFailIfNotAuthenticated() {
        var result = restTemplate.getForEntity(
                getBaseUrl() + "/api/patterns",
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that listing patterns only returns patterns owned by the logged in user.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/patterns should only return the authenticated user's patterns")
    public void listPatternsShouldOnlyReturnAuthenticatedUsersPatterns() throws Exception {
        createUsersAndPatterns();

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns",
                HttpMethod.GET,
                GetAuthEntity("pattern-user", "password"),
                PatternDto[].class);
        var patterns = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(patterns);
        assertEquals(3, patterns.length);
        assertEquals("First Pattern", patterns[0].pattern().getName());
        assertEquals("Second Pattern", patterns[1].pattern().getName());
        assertEquals("Third Pattern", patterns[2].pattern().getName());
        for (PatternDto pattern : patterns) {
            assertEquals("pattern-user", pattern.pattern().getUsername());
        }
    }

    /**
     * Tests that the optional limit caps the number of returned patterns.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/patterns should honor the optional limit")
    public void listPatternsShouldHonorLimit() throws Exception {
        createUsersAndPatterns();

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns?limit=2",
                HttpMethod.GET,
                GetAuthEntity("pattern-user", "password"),
                PatternDto[].class);
        var patterns = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(patterns);
        assertEquals(2, patterns.length);
        assertEquals("First Pattern", patterns[0].pattern().getName());
        assertEquals("Second Pattern", patterns[1].pattern().getName());
    }

    /**
     * Tests that negative limits are rejected.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/patterns should reject a negative limit")
    public void listPatternsShouldRejectNegativeLimit() throws Exception {
        executeSql("INSERT INTO flexpath_final.users (username, password) "
                + "VALUES ('pattern-user', 'password');");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns?limit=-1",
                HttpMethod.GET,
                GetAuthEntity("pattern-user", "password"),
                String.class);

        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
    }

    /**
     * Tests that a user can get one of their patterns.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/patterns/{patternId} should return an owned pattern")
    public void getPatternShouldReturnOwnedPattern() throws Exception {
        createUsersAndPatterns();
        Integer patternId = getJdbcTemplate().queryForObject(
                "SELECT pattern_id FROM flexpath_final.patterns WHERE name = 'Second Pattern';",
                Integer.class);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns/" + patternId,
                HttpMethod.GET,
                GetAuthEntity("pattern-user", "password"),
                PatternDto.class);
        var pattern = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(pattern);
        assertEquals("Second Pattern", pattern.pattern().getName());
        assertEquals("pattern-user", pattern.pattern().getUsername());
    }

    /**
     * Tests that a user cannot get another user's pattern.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/patterns/{patternId} should hide patterns owned by another user")
    public void getPatternShouldNotReturnAnotherUsersPattern() throws Exception {
        createUsersAndPatterns();
        Integer patternId = getJdbcTemplate().queryForObject(
                "SELECT pattern_id FROM flexpath_final.patterns WHERE name = 'Other User Pattern';",
                Integer.class);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns/" + patternId,
                HttpMethod.GET,
                GetAuthEntity("pattern-user", "password"),
                String.class);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    }

    /**
     * Tests that creating a pattern requires authentication.
     */
    @Test
    @DisplayName("POST /api/patterns should return a 401 if not authenticated")
    public void createPatternShouldFailIfNotAuthenticated() {
        var result = restTemplate.postForEntity(
                getBaseUrl() + "/api/patterns",
                Map.of("name", "Unauthenticated Pattern"),
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that a created pattern and its resources belong to the authenticated user.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("POST /api/patterns should create a pattern for the authenticated user")
    public void createPatternShouldUseAuthenticatedUser() throws Exception {
        executeSql("INSERT INTO flexpath_final.users (username, password) "
                + "VALUES ('pattern-user', 'password');");

        Map<String, Object> request = new LinkedHashMap<>();
        request.put("category", "Sweater");
        request.put("technique", "Crochet");
        request.put("name", "My Cardigan");
        request.put("designer", "Robin");
        request.put("description", "A cozy cardigan.");
        request.put("difficulty", "Beginner");
        request.put("link", "https://example.com/pattern");
        request.put("imageUrl", "https://example.com/pattern.jpg");
        request.put("tags", new String[] {"cozy"});
        request.put("yarn", new PatternYarn[] {
                new PatternYarn(0, 0, null, "Body", 4, 251, 142)
        });
        request.put("tools", new PatternTool[] {
                new PatternTool(0, 0, "Crochet hook", 5.5f)
        });
        request.put("materials", new PatternMaterial[] {
                new PatternMaterial(0, 0, "Buttons", "Wooden", 6, null, null)
        });

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns",
                HttpMethod.POST,
                GetAuthEntity("pattern-user", "password", request),
                Pattern.class);
        var createdPattern = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(createdPattern);
        assertEquals("pattern-user", createdPattern.getUsername());
        assertEquals("My Cardigan", createdPattern.getName());

        var jdbcTemplate = getJdbcTemplate();
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.tags WHERE username = ? AND name = ?;",
                        Integer.class,
                        "pattern-user",
                        "cozy"));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_yarns WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_tools WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.pattern_materials WHERE pattern_id = ?;",
                        Integer.class,
                        createdPattern.getPatternId()));
    }

    /**
     * Tests that deleting a pattern requires authentication.
     */
    @Test
    @DisplayName("DELETE /api/patterns/{patternId} should return a 401 if not authenticated")
    public void deletePatternShouldFailIfNotAuthenticated() {
        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns/1",
                HttpMethod.DELETE,
                null,
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that a user can delete one of their patterns.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("DELETE /api/patterns/{patternId} should delete an owned pattern")
    public void deletePatternShouldDeleteOwnedPattern() throws Exception {
        createUsersAndPatterns();
        Integer patternId = getJdbcTemplate().queryForObject(
                "SELECT pattern_id FROM flexpath_final.patterns WHERE name = 'Second Pattern';",
                Integer.class);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns/" + patternId,
                HttpMethod.DELETE,
                GetAuthEntity("pattern-user", "password"),
                String.class);

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertEquals(
                0,
                getJdbcTemplate().queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.patterns WHERE pattern_id = ?;",
                        Integer.class,
                        patternId));
    }

    /**
     * Tests that a user cannot delete another user's pattern.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("DELETE /api/patterns/{patternId} should hide patterns owned by another user")
    public void deletePatternShouldNotDeleteAnotherUsersPattern() throws Exception {
        createUsersAndPatterns();
        Integer patternId = getJdbcTemplate().queryForObject(
                "SELECT pattern_id FROM flexpath_final.patterns WHERE name = 'Other User Pattern';",
                Integer.class);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/patterns/" + patternId,
                HttpMethod.DELETE,
                GetAuthEntity("pattern-user", "password"),
                String.class);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals(
                1,
                getJdbcTemplate().queryForObject(
                        "SELECT COUNT(*) FROM flexpath_final.patterns WHERE pattern_id = ?;",
                        Integer.class,
                        patternId));
    }

    /**
     * Creates two users and patterns owned by each user.
     *
     * @throws Exception If test data cannot be created.
     */
    private void createUsersAndPatterns() throws Exception {
        executeSql("INSERT INTO flexpath_final.users (username, password) VALUES "
                + "('pattern-user', 'password'), ('other-user', 'password');");
        executeSql("INSERT INTO flexpath_final.patterns (username, name) VALUES "
                + "('pattern-user', 'First Pattern'), "
                + "('other-user', 'Other User Pattern'), "
                + "('pattern-user', 'Second Pattern'), "
                + "('pattern-user', 'Third Pattern');");
    }
}
