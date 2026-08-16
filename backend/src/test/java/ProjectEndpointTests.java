import org.example.SpringBootApplication;
import org.example.models.Project;
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
 * Tests for the authenticated user's project endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class ProjectEndpointTests extends WebStoreTest {
    /**
     * Tests that creating a project requires authentication.
     */
    @Test
    @DisplayName("POST /api/projects should return a 401 if not authenticated")
    public void createProjectShouldFailIfNotAuthenticated() {
        var result = restTemplate.postForEntity(
                getBaseUrl() + "/api/projects",
                Map.of("name", "Unauthenticated Project"),
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that a created project belongs to the authenticated user.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("POST /api/projects should create a project for the authenticated user")
    public void createProjectShouldUseAuthenticatedUser() throws Exception {
        createUsersAndPatterns();
        Integer patternId = getJdbcTemplate().queryForObject(
                "SELECT pattern_id FROM flexpath_final.patterns WHERE name = 'Owned Pattern';",
                Integer.class);

        Map<String, Object> request = new LinkedHashMap<>();
        request.put("patternId", patternId);
        request.put("name", "Birthday Cardigan");
        request.put("status", "In Progress");
        request.put("isPublic", true);
        request.put("care", "Hand wash and lay flat to dry.");
        request.put("gauge", "18 stitches per 4 inches");
        request.put("dateStarted", "2026-08-01");
        request.put("dateFinished", null);
        request.put("dateNeededBy", "2026-09-01");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/projects",
                HttpMethod.POST,
                GetAuthEntity("project-user", "password", request),
                Project.class);
        var createdProject = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(createdProject);
        assertEquals("project-user", createdProject.getUsername());
        assertEquals(patternId.intValue(), createdProject.getPatternId());
        assertEquals("Birthday Cardigan", createdProject.getName());
        assertEquals("In Progress", createdProject.getStatus());
        assertEquals(true, createdProject.isPublic());
        assertEquals(1, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM flexpath_final.projects WHERE username = ? AND name = ?;",
                Integer.class,
                "project-user",
                "Birthday Cardigan"));
    }

    /**
     * Tests that a project cannot be created from another user's pattern.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("POST /api/projects should hide patterns owned by another user")
    public void createProjectShouldNotUseAnotherUsersPattern() throws Exception {
        createUsersAndPatterns();
        Integer patternId = getJdbcTemplate().queryForObject(
                "SELECT pattern_id FROM flexpath_final.patterns WHERE name = 'Other Pattern';",
                Integer.class);

        var request = Map.of(
                "patternId", patternId,
                "name", "Stolen Project",
                "status", "Not Started",
                "isPublic", false);
        var result = restTemplate.exchange(
                getBaseUrl() + "/api/projects",
                HttpMethod.POST,
                GetAuthEntity("project-user", "password", request),
                String.class);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals(0, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM flexpath_final.projects;",
                Integer.class));
    }

    /**
     * Creates users and one pattern for each user.
     *
     * @throws Exception If test data cannot be created.
     */
    private void createUsersAndPatterns() throws Exception {
        executeSql("INSERT INTO flexpath_final.users (username, password) VALUES "
                + "('project-user', 'password'), ('other-user', 'password');");
        executeSql("INSERT INTO flexpath_final.patterns (username, name) VALUES "
                + "('project-user', 'Owned Pattern'), "
                + "('other-user', 'Other Pattern');");
    }
}
