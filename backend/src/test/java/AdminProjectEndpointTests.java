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
