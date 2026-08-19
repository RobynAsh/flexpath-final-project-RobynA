import org.example.SpringBootApplication;
import org.example.models.Milestone;
import org.example.dtos.RecentMilestoneDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import support.FinalTestConfiguration;
import support.WebStoreTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Tests for the authenticated user's milestone endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class MilestoneEndpointTests extends WebStoreTest {
    /**
     * Tests that reading recent milestones requires authentication.
     */
    @Test
    @DisplayName("GET /api/milestones/recent should return a 401 if not authenticated")
    public void recentMilestonesShouldFailIfNotAuthenticated() {
        var result = restTemplate.getForEntity(
                getBaseUrl() + "/api/milestones/recent",
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that only the current user's three newest milestones are returned.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("GET /api/milestones/recent should return the user's three newest milestones")
    public void recentMilestonesShouldReturnThreeNewestOwnedMilestones() throws Exception {
        createUsersAndProjects();
        executeSql("INSERT INTO flexpath_final.milestones "
                + "(project_id, note, row_count, repeat_count, created_at) "
                + "SELECT project_id, 'Oldest owned', 10, 1, '2026-01-01 10:00:00' "
                + "FROM flexpath_final.projects WHERE name = 'Owned Project';");
        executeSql("INSERT INTO flexpath_final.milestones "
                + "(project_id, note, row_count, repeat_count, created_at) "
                + "SELECT project_id, 'Third newest', 20, 2, '2026-02-01 10:00:00' "
                + "FROM flexpath_final.projects WHERE name = 'Owned Project';");
        executeSql("INSERT INTO flexpath_final.milestones "
                + "(project_id, note, row_count, repeat_count, created_at) "
                + "SELECT project_id, 'Second newest', 30, 3, '2026-03-01 10:00:00' "
                + "FROM flexpath_final.projects WHERE name = 'Owned Project';");
        executeSql("INSERT INTO flexpath_final.milestones "
                + "(project_id, note, row_count, repeat_count, created_at) "
                + "SELECT project_id, 'Newest owned', 40, 4, '2026-04-01 10:00:00' "
                + "FROM flexpath_final.projects WHERE name = 'Owned Project';");
        executeSql("INSERT INTO flexpath_final.milestones (project_id, note, created_at) "
                + "SELECT project_id, 'Other user newest', '2026-05-01 10:00:00' "
                + "FROM flexpath_final.projects WHERE name = 'Other Project';");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/milestones/recent",
                HttpMethod.GET,
                GetAuthEntity("milestone-user", "password", null),
                RecentMilestoneDto[].class);
        var milestones = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(milestones);
        assertEquals(3, milestones.length);
        assertEquals("Newest owned", milestones[0].milestone().getNote());
        assertEquals("Second newest", milestones[1].milestone().getNote());
        assertEquals("Third newest", milestones[2].milestone().getNote());
        assertEquals("Owned Project", milestones[0].projectName());
    }

    /**
     * Tests that creating a milestone requires authentication.
     */
    @Test
    @DisplayName("POST /api/milestones should return a 401 if not authenticated")
    public void createMilestoneShouldFailIfNotAuthenticated() {
        var result = restTemplate.postForEntity(
                getBaseUrl() + "/api/milestones",
                Map.of("projectId", 1, "note", "Finished a sleeve"),
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that a milestone can be added to a project owned by the logged-in user.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("POST /api/milestones should create a milestone for an owned project")
    public void createMilestoneShouldUseOwnedProject() throws Exception {
        createUsersAndProjects();
        Integer projectId = getJdbcTemplate().queryForObject(
                "SELECT project_id FROM flexpath_final.projects WHERE name = 'Owned Project';",
                Integer.class);
        var request = Map.of(
                "projectId", projectId,
                "note", "  Finished the first sleeve  ",
                "rowCount", 42,
                "repeatCount", 3);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/milestones",
                HttpMethod.POST,
                GetAuthEntity("milestone-user", "password", request),
                Milestone.class);
        var milestone = result.getBody();

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(milestone);
        assertEquals(projectId.intValue(), milestone.getProjectId());
        assertEquals("Finished the first sleeve", milestone.getNote());
        assertEquals(42, milestone.getRowCount());
        assertEquals(3, milestone.getRepeatCount());
        assertNotNull(milestone.getCreatedAt());
        assertEquals(1, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM flexpath_final.milestones WHERE project_id = ?;",
                Integer.class,
                projectId));
    }

    /**
     * Tests that a user cannot add a milestone to another user's project.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("POST /api/milestones should hide projects owned by another user")
    public void createMilestoneShouldNotUseAnotherUsersProject() throws Exception {
        createUsersAndProjects();
        Integer projectId = getJdbcTemplate().queryForObject(
                "SELECT project_id FROM flexpath_final.projects WHERE name = 'Other Project';",
                Integer.class);
        var request = Map.of(
                "projectId", projectId,
                "note", "Not my project",
                "rowCount", 1,
                "repeatCount", 0);

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/milestones",
                HttpMethod.POST,
                GetAuthEntity("milestone-user", "password", request),
                String.class);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals(0, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM flexpath_final.milestones;",
                Integer.class));
    }

    /**
     * Tests that deleting a milestone requires authentication.
     */
    @Test
    @DisplayName("DELETE /api/milestones/{milestoneId} should return a 401 if not authenticated")
    public void deleteMilestoneShouldFailIfNotAuthenticated() {
        var result = restTemplate.exchange(
                getBaseUrl() + "/api/milestones/1",
                HttpMethod.DELETE,
                null,
                String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that a user can delete a milestone from their own project.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("DELETE /api/milestones/{milestoneId} should delete an owned milestone")
    public void deleteMilestoneShouldDeleteOwnedMilestone() throws Exception {
        createUsersAndProjects();
        Integer milestoneId = createMilestoneForProject("Owned Project");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/milestones/" + milestoneId,
                HttpMethod.DELETE,
                GetAuthEntity("milestone-user", "password", null),
                String.class);

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertEquals(0, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM flexpath_final.milestones WHERE milestone_id = ?;",
                Integer.class,
                milestoneId));
    }

    /**
     * Tests that a user cannot delete a milestone from another user's project.
     *
     * @throws Exception If test data cannot be created.
     */
    @Test
    @DisplayName("DELETE /api/milestones/{milestoneId} should hide another user's milestone")
    public void deleteMilestoneShouldNotDeleteAnotherUsersMilestone() throws Exception {
        createUsersAndProjects();
        Integer milestoneId = createMilestoneForProject("Other Project");

        var result = restTemplate.exchange(
                getBaseUrl() + "/api/milestones/" + milestoneId,
                HttpMethod.DELETE,
                GetAuthEntity("milestone-user", "password", null),
                String.class);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals(1, getJdbcTemplate().queryForObject(
                "SELECT COUNT(*) FROM flexpath_final.milestones WHERE milestone_id = ?;",
                Integer.class,
                milestoneId));
    }

    /**
     * Creates two users and one project belonging to each user.
     *
     * @throws Exception If test data cannot be created.
     */
    private void createUsersAndProjects() throws Exception {
        executeSql("INSERT INTO flexpath_final.users (username, password) VALUES "
                + "('milestone-user', 'password'), ('other-user', 'password');");
        executeSql("INSERT INTO flexpath_final.patterns (username, name) VALUES "
                + "('milestone-user', 'Owned Pattern'), "
                + "('other-user', 'Other Pattern');");
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT username, pattern_id, 'Owned Project', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Owned Pattern';");
        executeSql("INSERT INTO flexpath_final.projects (username, pattern_id, name, status) "
                + "SELECT username, pattern_id, 'Other Project', 'In Progress' "
                + "FROM flexpath_final.patterns WHERE name = 'Other Pattern';");
    }

    /**
     * Creates a milestone for the project with the supplied name.
     *
     * @param projectName The project that owns the milestone.
     * @return The new milestone id.
     * @throws Exception If the milestone cannot be created.
     */
    private Integer createMilestoneForProject(String projectName) throws Exception {
        executeSql("INSERT INTO flexpath_final.milestones (project_id, note) "
                + "SELECT project_id, 'Test milestone' FROM flexpath_final.projects "
                + "WHERE name = '" + projectName + "';");
        return getJdbcTemplate().queryForObject(
                "SELECT milestone_id FROM flexpath_final.milestones WHERE note = 'Test milestone';",
                Integer.class);
    }
}
