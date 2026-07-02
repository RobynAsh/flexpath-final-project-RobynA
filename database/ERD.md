# Crochet / Knitting Project Tracker ERD

This proposed entity relationship diagram is based on `SPECS.md`. It keeps
patterns, projects, yarn, tools, photos, milestones, and logs tied to the owning
user, while still allowing admins to query and manage the same records.

```mermaid
erDiagram
    USER {
        varchar username PK
        varchar password
    }

    ROLE {
        varchar username PK, FK
        varchar role PK
    }

    PATTERN {
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

    TAG {
        int tag_id PK
        varchar name
    }

    PATTERN_TAG {
        int pattern_id PK, FK
        int tag_id PK, FK
    }

    PROJECT {
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

    YARN {
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

    TOOL {
        int tool_id PK
        varchar tool_type
        varchar brand
        float size_mm
        varchar material
        datetime created_at
        datetime updated_at
    }

    PATTERN_YARN {
        int pattern_yarn_id PK
        int pattern_id FK
        int suggested_yarn_id FK
        varchar description
        int weight
        int yardage
        float grams
    }

    PATTERN_TOOL {
        int pattern_tool_id PK
        int pattern_id FK
        varchar tool_type
        float size_mm
    }

    PATTERN_MATERIAL {
        int pattern_material_id PK
        int pattern_id FK
        varchar name
        varchar description
        int quantity
        datetime created_at
        datetime updated_at
    }

    PROJECT_YARN {
        int project_yarn_id PK
        int project_id FK
        int pattern_yarn_id FK
        int stash_yarn_id FK
        int yardage_used
        datetime created_at
        datetime updated_at
        datetime removed_at
    }

    PROJECT_TOOL {
        int project_tool_id PK
        int project_id FK
        int pattern_tool_id FK
        int stash_tool_id FK
        datetime created_at
        datetime removed_at
    }

    PROJECT_MATERIAL {
        int pattern_material_id PK, FK
        int project_id PK, FK
    }

    STASH_YARN {
        int stash_yarn_id PK
        varchar username FK
        int yarn_id FK
        boolean is_scrap
        int scrap_yardage
        int quantity
        datetime created_at
        datetime updated_at
        datetime removed_at
    }

    STASH_TOOL {
        int stash_tool_id PK
        varchar username FK
        int tool_id FK
        int quantity
        datetime created_at
        datetime updated_at
        datetime removed_at
    }

    MILESTONE {
        int milestone_id PK
        int project_id FK
        text note
        int row_count
        int repeat_count
        datetime created_at
        datetime updated_at
    }

    PHOTO {
        int photo_id PK
        int project_id FK
        int milestone_id FK
        varchar image_url
        boolean is_marquee
        datetime created_at
        datetime updated_at
    }

    PROJECT_RESOURCE_LOG {
        int log_id PK
        int project_id FK
        varchar resource_type
        int resource_id
        varchar action
        int quantity_changed
        datetime created_at
    }

    USER_LOG {
        int user_log_id PK
        varchar username FK
        varchar action
        varchar entity_type
        int entity_id
        datetime created_at
    }

    USER ||--o{ ROLE : has
    USER ||--o{ PATTERN : owns
    USER ||--o{ PROJECT : owns
    USER ||--o{ STASH_YARN : owns
    USER ||--o{ STASH_TOOL : owns
    USER ||--o{ USER_LOG : generates

    PATTERN ||--o{ PROJECT : used_for
    PATTERN ||--o{ PATTERN_TAG : has
    TAG ||--o{ PATTERN_TAG : labels
    PATTERN ||--o{ PATTERN_YARN : needs
    YARN ||--o{ PATTERN_YARN : suggested_for
    PATTERN ||--o{ PATTERN_TOOL : needs
    PATTERN ||--o{ PATTERN_MATERIAL : may_need

    PROJECT ||--o{ PROJECT_YARN : uses
    STASH_YARN ||--o{ PROJECT_YARN : assigned_to
    PATTERN_YARN ||--o{ PROJECT_YARN : assigned_to
    PROJECT ||--o{ PROJECT_TOOL : uses
    STASH_TOOL ||--o{ PROJECT_TOOL : uses
    PATTERN_TOOL ||--o{ PROJECT_TOOL : assigned_to
    PROJECT ||--o{ PROJECT_MATERIAL : uses
    PATTERN_MATERIAL ||--o{ PROJECT_MATERIAL : assigned_to

    YARN ||--o{ STASH_YARN : defines
    TOOL ||--o{ STASH_TOOL : defines

    PROJECT ||--o{ MILESTONE : tracks
    PROJECT ||--o{ PHOTO : has
    MILESTONE ||--o{ PHOTO : may_include
    PROJECT ||--o{ PROJECT_RESOURCE_LOG : records
```

## Design Notes

- `PROJECT_RESOURCE_LOG.resource_type` and `PROJECT_RESOURCE_LOG.resource_id`
  intentionally form a polymorphic reference instead of a strict foreign key.
  This lets one log table record yarn, tool, material, or other future resource
  changes without needing a separate log table for each resource type.
- `YARN` and `TOOL` act as reusable catalog-style definitions, while
  `STASH_YARN` and `STASH_TOOL` represent the specific inventory owned by a
  user. Projects should assign stash records, not the base catalog records, so
  inventory usage can be tracked per user.
- `PATTERN_YARN`, `PATTERN_TOOL`, and `PATTERN_MATERIAL` describe what a pattern
  recommends or may require. `PROJECT_YARN`, `PROJECT_TOOL`, and
  `PROJECT_MATERIAL` describe what a user actually assigns to a specific
  project.
- `PATTERN_MATERIAL` is connected with `may_need` because non-yarn materials are
  optional checklist items. A project can include only the materials that are
  relevant to that user's version of the pattern.
- `TAG` and `PATTERN_TAG` support reusable many-to-many pattern tagging, which
  allows searching and filtering patterns by labels without storing duplicate
  comma-separated tag text on `PATTERN`.
- `PHOTO.milestone_id` can be nullable in the physical database. This allows a
  photo to either belong to a specific timeline milestone or appear only in the
  project's general gallery.
- Admin access does not require separate ownership tables. Admin permissions can
  come from `ROLE`, while admin views and analytics can query across the same
  user-owned project, pattern, stash, and log tables.
