# Crochet / Knitting Project Tracker ERD

This proposed entity relationship diagram is based on `SPECS.md`. It keeps
patterns, projects, yarn, tools, photos, milestones, and logs tied to the owning
user, while still allowing admins to query and manage the same records.

```mermaid
erDiagram
    USERS {
        varchar username PK
        varchar password
    }

    ROLES {
        varchar username PK, FK
        varchar role PK
    }

    PATTERNS {
        int pattern_id PK
        varchar username FK
        varchar category
        varchar technique
        varchar name
        varchar designer
        varchar description
        varchar difficulty
        varchar link
        varchar image_url
        datetime created_at
        datetime updated_at
    }

    TAGS {
        int tag_id PK
        varchar username FK
        varchar name
    }

    PATTERN_TAGS {
        int pattern_id PK, FK
        int tag_id PK, FK
    }

    PROJECT_TAGS {
        int project_id PK, FK
        int tag_id PK, FK
    }

    PROJECTS {
        int project_id PK
        varchar username FK
        int pattern_id FK
        varchar name
        varchar status
        boolean is_public
        varchar care
        varchar gauge
        date date_started
        date date_finished
        date date_needed_by
        datetime created_at
        datetime updated_at
    }

    PATTERN_YARNS {
        int pattern_yarn_id PK
        int pattern_id FK
        varchar description
        int weight
        int yardage
        float grams
    }

    PATTERN_TOOLS {
        int pattern_tool_id PK
        int pattern_id FK
        varchar tool_type
        float size_mm
    }

    PATTERN_MATERIALS {
        int pattern_material_id PK
        int pattern_id FK
        varchar name
        varchar description
        int quantity
        datetime created_at
        datetime updated_at
    }

    MILESTONES {
        int milestone_id PK
        int project_id FK
        text note
        int row_count
        int repeat_count
        datetime created_at
        datetime updated_at
    }

    USER_LOGS {
        int user_log_id PK
        varchar username FK
        varchar action
        varchar entity_type
        int entity_id
        datetime created_at
    }

    USERS ||--o{ ROLES : has
    USERS ||--o{ PATTERNS : owns
    USERS ||--o{ PROJECTS : owns
    USERS ||--o{ TAGS : owns
    USERS ||--o{ USER_LOGS : generates

    PATTERNS ||--o{ PROJECTS : used_for
    PATTERNS ||--o{ PATTERN_TAGS : has
    TAGS ||--o{ PATTERN_TAGS : labels
    PROJECTS ||--o{ PROJECT_TAGS : has
    TAGS ||--o{ PROJECT_TAGS : labels
    PATTERNS ||--o{ PATTERN_YARNS : needs
    PATTERNS ||--o{ PATTERN_TOOLS : needs
    PATTERNS ||--o{ PATTERN_MATERIALS : may_need

    PROJECTS ||--o{ MILESTONES : tracks
```

## Design Notes

- This ERD_SIMPLIFIED.md file is a scaled back version of ERD.md - I made the larger ERD.md
  to encompass everything I want this project to do for myself. However, as I have been working
  through this project it is clear that the inventory work for a project is more in-depth than
  I am able to do currently within the confines of this project's requirements.
- `PATTERN_YARNS`, `PATTERN_TOOLS`, and `PATTERN_MATERIALS` describe what a pattern
  recommends or may require.
- `PATTERN_MATERIALS` is connected with `may_need` because non-yarn materials are
  optional checklist items. A project can include only the materials that are
  relevant to that user's version of the pattern.
- `TAGS`, `PATTERN_TAGS`, and `PROJECT_TAGS` support reusable user-owned tagging
  for patterns and projects without storing duplicate comma-separated tag text on
  either entity. Tag names are scoped to a user instead of being globally unique.
- Admin access does not require separate ownership tables. Admin permissions can
  come from `ROLES`, while admin views and analytics can query across the same
  user-owned projects, patterns, stash, and log tables.
