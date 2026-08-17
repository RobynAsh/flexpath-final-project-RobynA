import org.example.SpringBootApplication;
import org.example.dtos.ProjectDto;
import org.example.dtos.ProjectSummaryDto;
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
     * Tests that listing projects requires authentication.
     */
    @Test
    @DisplayName("GET /api/projects should return a 401 if not authenticated")
    public void listProjectsShouldFailIfNotAuthenticated() {
        var result = restTemplate.getForEntity(
                getBaseUrl() + "/api/projects",
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that listing projects only returns projects owned by the logged-in user.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/projects should only return the authenticated user's projects")
    public void listProjectsShouldOnlyReturnOwnedProjects() throws Exception {
        createUsersAndPatterns();
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT 'project-user', pattern_id, 'Owned Project', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Owned Pattern';");
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT 'other-user', pattern_id, 'Other Project', 'Completed' "
                + "FROM flexpath_final.patterns WHERE name = 'Other Pattern';");
        executeSql("INSERT INTO flexpath_final.tags (username, name) VALUES ('project-user', 'gift');");
        executeSql("INSERT INTO flexpath_final.project_tags (project_id, tag_id) "
                + "SELECT p.project_id, t.tag_id FROM flexpath_final.projects p "
                + "JOIN flexpath_final.tags t ON t.username = p.username "
                + "WHERE p.name = 'Owned Project' AND t.name = 'gift';");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/projects",
                HttpMethod.GET,
                GetAuthEntity("project-user", "password"),
                ProjectSummaryDto[].class);
        var projects = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(projects);
        assertEquals(1, projects.length);
        assertEquals("Owned Project", projects[0].project().getName());
        assertEquals("project-user", projects[0].project().getUsername());
        assertEquals("gift", projects[0].tags().get(0).getName());
    }

    /**
     * Tests that getting a project returns its pattern and all pattern resources.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/projects/{projectId} should return full owned project details")
    public void getProjectShouldReturnFullOwnedProjectDetails() throws Exception {
        createUsersAndPatterns();
        executeSql("UPDATE flexpath_final.patterns SET category = 'Garment', "
                + "technique = 'Knitting', designer = 'Test Designer', "
                + "description = 'A warm cardigan', difficulty = 'Intermediate', "
                + "link = 'https://example.com/pattern', image_url = 'https://example.com/image.jpg' "
                + "WHERE name = 'Owned Pattern';");
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT 'project-user', pattern_id, 'Owned Project', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Owned Pattern';");
        executeSql("INSERT INTO flexpath_final.tags (username, name) VALUES ('project-user', 'cardigan');");
        executeSql("INSERT INTO flexpath_final.project_tags (project_id, tag_id) "
                + "SELECT p.project_id, t.tag_id FROM flexpath_final.projects p "
                + "JOIN flexpath_final.tags t ON t.username = p.username "
                + "WHERE p.name = 'Owned Project' AND t.name = 'cardigan';");
        executeSql("INSERT INTO flexpath_final.pattern_yarns "
                + "(pattern_id, description, weight, yardage, grams) "
                + "SELECT pattern_id, 'Worsted wool', 4, 800, 400 "
                + "FROM flexpath_final.patterns WHERE name = 'Owned Pattern';");
        executeSql("INSERT INTO flexpath_final.pattern_tools (pattern_id, tool_type, size_mm) "
                + "SELECT pattern_id, 'Needles', 5.0 "
                + "FROM flexpath_final.patterns WHERE name = 'Owned Pattern';");
        executeSql("INSERT INTO flexpath_final.pattern_materials "
                + "(pattern_id, name, description, quantity) "
                + "SELECT pattern_id, 'Buttons', 'Wooden buttons', 6 "
                + "FROM flexpath_final.patterns WHERE name = 'Owned Pattern';");
        Integer projectId = getJdbcTemplate().queryForObject(
                "SELECT project_id FROM flexpath_final.projects WHERE name = 'Owned Project';",
                Integer.class);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/projects/" + projectId,
                HttpMethod.GET,
                GetAuthEntity("project-user", "password"),
                ProjectDto.class);
        var details = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(details);
        assertEquals("Owned Project", details.project().getName());
        assertEquals("cardigan", details.tags().get(0).getName());
        assertEquals("Owned Pattern", details.pattern().getName());
        assertEquals("Test Designer", details.pattern().getDesigner());
        assertEquals("Worsted wool", details.yarn().get(0).getDescription());
        assertEquals("Needles", details.tools().get(0).getToolType());
        assertEquals("Buttons", details.materials().get(0).getName());
    }

    /**
     * Tests that a user cannot get another user's project.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/projects/{projectId} should hide projects owned by another user")
    public void getProjectShouldNotReturnAnotherUsersProject() throws Exception {
        createUsersAndPatterns();
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT 'other-user', pattern_id, 'Other Project', 'Completed' "
                + "FROM flexpath_final.patterns WHERE name = 'Other Pattern';");
        Integer projectId = getJdbcTemplate().queryForObject(
                "SELECT project_id FROM flexpath_final.projects WHERE name = 'Other Project';",
                Integer.class);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/projects/" + projectId,
                HttpMethod.GET,
                GetAuthEntity("project-user", "password"),
                String.class);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    }

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
        request.put("tags", new String[] {"gift", "cardigan"});
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
        assertEquals(2, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM flexpath_final.project_tags WHERE project_id = ?;",
                Integer.class,
                createdProject.getProjectId()));
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
