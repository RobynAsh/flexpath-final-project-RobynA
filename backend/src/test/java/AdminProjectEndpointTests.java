import org.example.SpringBootApplication;
import org.example.dtos.CreateAdminProjectDto;
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

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Tests for the admin project endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class AdminProjectEndpointTests extends WebStoreTest {
    @Test
    @DisplayName("GET /api/admin/projects/all should return a 401 if not authorized")
    public void listProjectsShouldFailIfNotAuthorized() {
        var result = restTemplate.getForEntity(
                getBaseUrl() + "/api/admin/projects/all",
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    @Test
    @DisplayName("GET /api/admin/projects/all should return every project with tags")
    public void listProjectsShouldReturnAllProjects() throws Exception {
        createPattern();
        executeSql("INSERT INTO flexpath_final.projects "
                + "(username, pattern_id, name, status) "
                + "SELECT username, pattern_id, 'Listed Project', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Admin Pattern';");
        executeSql("INSERT INTO flexpath_final.tags (username, name) "
                + "VALUES ('test-admin', 'gift');");
        executeSql("INSERT INTO flexpath_final.project_tags (project_id, tag_id) "
                + "SELECT p.project_id, t.tag_id FROM flexpath_final.projects p "
                + "JOIN flexpath_final.tags t ON t.username = p.username "
                + "WHERE p.name = 'Listed Project' AND t.name = 'gift';");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/admin/projects/all",
                HttpMethod.GET,
                GetAuthEntity("test-admin", "admin"),
                ProjectSummaryDto[].class);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().length);
        assertEquals("Listed Project", result.getBody()[0].project().getName());
        assertEquals("gift", result.getBody()[0].tags().get(0).getName());
    }

    @Test
    @DisplayName("GET /api/admin/projects/all should filter every supported field")
    public void listProjectsShouldFilterSupportedFields() throws Exception {
        createPattern();
        executeSql("INSERT INTO flexpath_final.users (username, password) "
                + "VALUES ('project-owner', 'password');");
        executeSql("INSERT INTO flexpath_final.patterns (username, name) "
                + "VALUES ('project-owner', 'Other Pattern');");
        executeSql("INSERT INTO flexpath_final.projects "
                + "(username, pattern_id, name, status, is_public, care, gauge, "
                + "date_started, date_finished, date_needed_by, created_at, updated_at) "
                + "SELECT 'test-admin', pattern_id, 'Alpine Cardigan', 'In Progress', TRUE, "
                + "'Lay flat', '18 stitches', '2024-01-02', '2024-05-06', '2024-06-07', "
                + "'2024-01-02 03:04:05', '2025-06-07 08:09:10' "
                + "FROM flexpath_final.patterns WHERE name = 'Admin Pattern';");
        executeSql("INSERT INTO flexpath_final.projects "
                + "(username, pattern_id, name, status, is_public, care, gauge, "
                + "date_started, date_finished, date_needed_by, created_at, updated_at) "
                + "SELECT 'project-owner', pattern_id, 'Basic Hat', 'Not Started', FALSE, "
                + "'Machine wash', '20 stitches', '2023-02-03', NULL, '2023-07-08', "
                + "'2023-02-03 04:05:06', '2023-07-08 09:10:11' "
                + "FROM flexpath_final.patterns WHERE name = 'Other Pattern';");

        Map<String, String> filters = Map.ofEntries(
                Map.entry("name", "ALPINE"),
                Map.entry("username", "TEST-ADM"),
                Map.entry("status", "progress"),
                Map.entry("public", "public"),
                Map.entry("care", "lay fl"),
                Map.entry("gauge", "18 stitch"),
                Map.entry("dateStarted", "2024-01-02"),
                Map.entry("dateFinished", "2024-05-06"),
                Map.entry("dateNeededBy", "2024-06-07"),
                Map.entry("createdAt", "2024-01-02"),
                Map.entry("updatedAt", "2025-06-07"));

        for (Map.Entry<String, String> filter : filters.entrySet()) {
            var result = restTemplate.exchange(
                    getBaseUrl() + "/api/admin/projects/all?filterField=" + filter.getKey()
                            + "&filterText=" + filter.getValue()
                            + "&sortField=name&sortDirection=ascending",
                    HttpMethod.GET,
                    GetAuthEntity("test-admin", "admin"),
                    ProjectSummaryDto[].class);

            assertEquals(HttpStatus.OK, result.getStatusCode(), filter.getKey());
            assertNotNull(result.getBody(), filter.getKey());
            assertEquals(1, result.getBody().length, filter.getKey());
            assertEquals("Alpine Cardigan", result.getBody()[0].project().getName(), filter.getKey());
        }
    }

    @Test
    @DisplayName("GET /api/admin/projects/all should sort projects")
    public void listProjectsShouldSortProjects() throws Exception {
        createPattern();
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT username, pattern_id, 'Second Project', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Admin Pattern';");
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT username, pattern_id, 'First Project', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Admin Pattern';");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/admin/projects/all"
                        + "?sortField=name&sortDirection=descending",
                HttpMethod.GET,
                GetAuthEntity("test-admin", "admin"),
                ProjectSummaryDto[].class);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Second Project", result.getBody()[0].project().getName());
        assertEquals("First Project", result.getBody()[1].project().getName());
    }

    @Test
    @DisplayName("GET /api/admin/projects/all should reject unsupported query options")
    public void listProjectsShouldRejectUnsupportedQueryOptions() throws Exception {
        for (String query : List.of(
                "filterField=projectId&filterText=1",
                "sortField=status&sortDirection=ascending",
                "sortField=name&sortDirection=sideways")) {
            var result = restTemplate.exchange(
                    getBaseUrl() + "/api/admin/projects/all?" + query,
                    HttpMethod.GET,
                    GetAuthEntity("test-admin", "admin"),
                    String.class);

            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode(), query);
        }
    }

    @Test
    @DisplayName("Admin project endpoints should create, update, and delete a project")
    public void projectCrudShouldSucceedForAdmin() throws Exception {
        int patternId = createPattern();
        var createRequest = projectRequest(patternId, "Created Project", new String[] { "new" });
        var createResult = restTemplate.exchange(
                getBaseUrl() + "/api/admin/projects",
                HttpMethod.POST,
                GetAuthEntity("test-admin", "admin", createRequest),
                Project.class);

        assertEquals(HttpStatus.CREATED, createResult.getStatusCode());
        assertNotNull(createResult.getBody());
        int projectId = createResult.getBody().getProjectId();
        assertEquals("test-admin", createResult.getBody().getUsername());

        var updateRequest = projectRequest(patternId, "Updated Project", new String[] { "updated" });
        var updateResult = restTemplate.exchange(
                getBaseUrl() + "/api/admin/projects/" + projectId,
                HttpMethod.PUT,
                GetAuthEntity("test-admin", "admin", updateRequest),
                Project.class);

        assertEquals(HttpStatus.OK, updateResult.getStatusCode());
        assertNotNull(updateResult.getBody());
        assertEquals("Updated Project", updateResult.getBody().getName());

        var deleteResult = restTemplate.exchange(
                getBaseUrl() + "/api/admin/projects/" + projectId,
                HttpMethod.DELETE,
                GetAuthEntity("test-admin", "admin"),
                Void.class);

        assertEquals(HttpStatus.NO_CONTENT, deleteResult.getStatusCode());
        assertEquals(0, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM projects WHERE project_id = ?;",
                Integer.class,
                projectId));
    }

    private int createPattern() throws Exception {
        executeSql("INSERT INTO flexpath_final.patterns "
                + "(username, category, technique, name) "
                + "VALUES ('test-admin', 'Accessory', 'Knitting', 'Admin Pattern');");
        return getJdbcTemplate().queryForObject(
                "SELECT pattern_id FROM patterns WHERE name = 'Admin Pattern';",
                Integer.class);
    }

    private CreateAdminProjectDto projectRequest(int patternId, String name, String[] tags) {
        return new CreateAdminProjectDto(
                "test-admin",
                patternId,
                name,
                "In Progress",
                true,
                "Hand wash",
                "18 stitches",
                tags,
                LocalDate.of(2026, 8, 1),
                null,
                LocalDate.of(2026, 9, 1));
    }
}
