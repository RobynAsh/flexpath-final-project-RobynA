import org.example.SpringBootApplication;
import org.example.dtos.PatternDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import support.FinalTestConfiguration;
import support.WebStoreTest;

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
