import org.example.SpringBootApplication;
import org.example.models.Pattern;
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
 * Tests for the pattern endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class PatternEndpointTests extends WebStoreTest {
    /**
     * Tests that creating a pattern fails if not authorized.
     */
    @Test
    @DisplayName("POST /api/patterns should return a 401 if not authorized")
    public void createPatternShouldFailIfNotAuthorized() {
        var result = this.restTemplate.postForEntity(
                getBaseUrl() + "/api/patterns",
                createPattern(),
                String.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
    }

    /**
     * Tests that creating a pattern succeeds if authorized.
     */
    @Test
    @DisplayName("POST /api/patterns should return a 201 and the created pattern if authorized")
    public void createPatternShouldSucceedIfAuthorized() {
        var requestEntity = GetAuthEntity("test-admin", "admin", createPattern());
        var result = this.restTemplate.exchange(
                getBaseUrl() + "/api/patterns",
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
