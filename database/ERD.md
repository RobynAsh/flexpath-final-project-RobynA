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

    YARNS {
        int yarn_id PK
        varchar brand
        varchar colorway
        varchar color
        varchar weight
        varchar fiber
        varchar style
        int yardage
        float grams
        varchar image_url
        datetime created_at
        datetime updated_at
    }

    TOOLS {
        int tool_id PK
        varchar tool_type
        varchar brand
        float size_mm
        varchar material
        datetime created_at
        datetime updated_at
    }

    PATTERN_YARNS {
        int pattern_yarn_id PK
        int pattern_id FK
        int suggested_yarn_id FK
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

    PROJECT_YARNS {
        int project_yarn_id PK
        int project_id FK
        int pattern_yarn_id FK
        int stash_yarn_id FK
        int yardage_used
        datetime created_at
        datetime updated_at
        datetime removed_at
    }

    PROJECT_TOOLS {
        int project_tool_id PK
        int project_id FK
        int pattern_tool_id FK
        int stash_tool_id FK
        datetime created_at
        datetime removed_at
    }

    PROJECT_MATERIALS {
        int pattern_material_id PK, FK
        int project_id PK, FK
    }

    STASH_YARNS {
        int stash_yarn_id PK
        varchar username FK
        int yarn_id FK
        varchar dye_lot
        boolean is_scrap
        int scrap_yardage
        int quantity
        datetime created_at
        datetime updated_at
        datetime removed_at
    }

    STASH_TOOLS {
        int stash_tool_id PK
        varchar username FK
        int tool_id FK
        int quantity
        datetime created_at
        datetime updated_at
        datetime removed_at
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

    PHOTOS {
        int photo_id PK
        int project_id FK
        int milestone_id FK
        varchar image_url
        boolean is_marquee
        datetime created_at
        datetime updated_at
    }

    PROJECT_RESOURCE_LOGS {
        int log_id PK
        int project_id FK
        varchar resource_type
        int resource_id
        varchar action
        int quantity_changed
        datetime created_at
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
    USERS ||--o{ STASH_YARNS : owns
    USERS ||--o{ STASH_TOOLS : owns
    USERS ||--o{ USER_LOGS : generates

    PATTERNS ||--o{ PROJECTS : used_for
    PATTERNS ||--o{ PATTERN_TAGS : has
    TAGS ||--o{ PATTERN_TAGS : labels
    PROJECTS ||--o{ PROJECT_TAGS : has
    TAGS ||--o{ PROJECT_TAGS : labels
    PATTERNS ||--o{ PATTERN_YARNS : needs
    YARNS ||--o{ PATTERN_YARNS : suggested_for
    PATTERNS ||--o{ PATTERN_TOOLS : needs
    PATTERNS ||--o{ PATTERN_MATERIALS : may_need

    PROJECTS ||--o{ PROJECT_YARNS : uses
    STASH_YARNS ||--o{ PROJECT_YARNS : assigned_to
    PATTERN_YARNS ||--o{ PROJECT_YARNS : assigned_to
    PROJECTS ||--o{ PROJECT_TOOLS : uses
    STASH_TOOLS ||--o{ PROJECT_TOOLS : uses
    PATTERN_TOOLS ||--o{ PROJECT_TOOLS : assigned_to
    PROJECTS ||--o{ PROJECT_MATERIALS : uses
    PATTERN_MATERIALS ||--o{ PROJECT_MATERIALS : assigned_to

    YARNS ||--o{ STASH_YARNS : defines
    TOOLS ||--o{ STASH_TOOLS : defines

    PROJECTS ||--o{ MILESTONES : tracks
    PROJECTS ||--o{ PHOTOS : has
    MILESTONES ||--o{ PHOTOS : may_include
    PROJECTS ||--o{ PROJECT_RESOURCE_LOGS : records
```

## Design Notes

- `PROJECT_RESOURCE_LOGS.resource_type` and `PROJECT_RESOURCE_LOGS.resource_id`
  intentionally form a polymorphic reference instead of a strict foreign key.
  This lets one log table record yarn, tool, material, or other future resource
  changes without needing a separate log table for each resource type.
- `YARNS` and `TOOLS` act as reusable catalog-style definitions, while
  `STASH_YARNS` and `STASH_TOOLS` represent the specific inventory owned by a
  user. Projects should assign stash records, not the base catalog records, so
  inventory usage can be tracked per user.
- `PATTERN_YARNS`, `PATTERN_TOOLS`, and `PATTERN_MATERIALS` describe what a pattern
  recommends or may require. `PROJECT_YARNS`, `PROJECT_TOOLS`, and
  `PROJECT_MATERIALS` describe what a user actually assigns to a specific
  project.
- `PATTERN_MATERIALS` is connected with `may_need` because non-yarn materials are
  optional checklist items. A project can include only the materials that are
  relevant to that user's version of the pattern.
- `TAGS`, `PATTERN_TAGS`, and `PROJECT_TAGS` support reusable user-owned tagging
  for patterns and projects without storing duplicate comma-separated tag text on
  either entity. Tag names are scoped to a user instead of being globally unique.
- `PHOTOS.milestone_id` can be nullable in the physical database. This allows a
  photo to either belong to a specific timeline milestone or appear only in the
  project's general gallery.
- Admin access does not require separate ownership tables. Admin permissions can
  come from `ROLES`, while admin views and analytics can query across the same
  user-owned projects, patterns, stash, and log tables.
