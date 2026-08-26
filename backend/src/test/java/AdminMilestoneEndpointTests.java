import org.example.SpringBootApplication;
import org.example.dtos.AdminMilestoneDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import support.FinalTestConfiguration;
import support.WebStoreTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Tests for the admin milestone endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class AdminMilestoneEndpointTests extends WebStoreTest {
    @Test
    @DisplayName("GET /api/admin/milestones/all should return a 401 if not authorized")
    public void listMilestonesShouldFailIfNotAuthorized() {
        var result = restTemplate.getForEntity(
                getBaseUrl() + "/api/admin/milestones/all",
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    @Test
    @DisplayName("GET /api/admin/milestones/all should filter every supported field")
    public void listMilestonesShouldFilterSupportedFields() throws Exception {
        createMilestones();

        Map<String, String> filters = Map.ofEntries(
                Map.entry("projectName", "ALPINE"),
                Map.entry("username", "TEST-ADM"),
                Map.entry("note", "SLEEVES"),
                Map.entry("rowCount", "24"),
                Map.entry("repeatCount", "3"),
                Map.entry("createdAt", "2024-01-02"),
                Map.entry("updatedAt", "2025-06-07"));

        for (Map.Entry<String, String> filter : filters.entrySet()) {
            var result = restTemplate.exchange(
                    getBaseUrl() + "/api/admin/milestones/all?filterField=" + filter.getKey()
                            + "&filterText=" + filter.getValue()
                            + "&sortField=createdAt&sortDirection=ascending",
                    HttpMethod.GET,
                    GetAuthEntity("test-admin", "admin"),
                    AdminMilestoneDto[].class);

            assertEquals(HttpStatus.OK, result.getStatusCode(), filter.getKey());
            assertNotNull(result.getBody(), filter.getKey());
            assertEquals(1, result.getBody().length, filter.getKey());
            assertEquals("Alpine Cardigan", result.getBody()[0].projectName(), filter.getKey());
        }
    }

    @Test
    @DisplayName("GET /api/admin/milestones/all should sort milestones")
    public void listMilestonesShouldSortMilestones() throws Exception {
        createMilestones();

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/admin/milestones/all"
                        + "?sortField=projectName&sortDirection=ascending",
                HttpMethod.GET,
                GetAuthEntity("test-admin", "admin"),
                AdminMilestoneDto[].class);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(List.of("Alpine Cardigan", "Basic Hat"),
                List.of(result.getBody()[0].projectName(), result.getBody()[1].projectName()));
    }

    @Test
    @DisplayName("GET /api/admin/milestones/all should reject unsupported query options")
    public void listMilestonesShouldRejectUnsupportedQueryOptions() throws Exception {
        for (String query : List.of(
                "filterField=milestoneId&filterText=1",
                "sortField=note&sortDirection=ascending",
                "sortField=createdAt&sortDirection=sideways")) {
            var result = restTemplate.exchange(
                    getBaseUrl() + "/api/admin/milestones/all?" + query,
                    HttpMethod.GET,
                    GetAuthEntity("test-admin", "admin"),
                    String.class);

            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode(), query);
        }
    }

    private void createMilestones() throws Exception {
        executeSql("INSERT INTO flexpath_final.users (username, password) "
                + "VALUES ('milestone-owner', 'password');");
        executeSql("INSERT INTO flexpath_final.patterns (username, name) VALUES "
                + "('test-admin', 'Admin Pattern'), "
                + "('milestone-owner', 'Other Pattern');");
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT 'test-admin', pattern_id, 'Alpine Cardigan', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Admin Pattern';");
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT 'milestone-owner', pattern_id, 'Basic Hat', 'Not Started' "
                + "FROM flexpath_final.patterns WHERE name = 'Other Pattern';");
        executeSql("INSERT INTO flexpath_final.milestones "
                + "(project_id, note, row_count, repeat_count, created_at, updated_at) "
                + "SELECT project_id, 'Finished the sleeves', 24, 3, "
                + "'2024-01-02 03:04:05', '2025-06-07 08:09:10' "
                + "FROM flexpath_final.projects WHERE name = 'Alpine Cardigan';");
        executeSql("INSERT INTO flexpath_final.milestones "
                + "(project_id, note, row_count, repeat_count, created_at, updated_at) "
                + "SELECT project_id, 'Completed the brim', 12, 1, "
                + "'2023-02-03 04:05:06', '2023-07-08 09:10:11' "
                + "FROM flexpath_final.projects WHERE name = 'Basic Hat';");
    }
}
