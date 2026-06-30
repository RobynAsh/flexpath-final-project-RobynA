# Robyn's Final

## Overview
A website that allows users to track their crocheting/knitting projects, and search for new ideas from a third-party API.

## Features

### Permissions

- Projects can be toggled between Public / Private
  - Public projects will have redacted information, compared to what the original user will see.
- Patterns & Inventory are always private to the user.
- Analytics are private only to the logged in user, for their specific projects / patterns.
- Admins can view / modify all information, admins will have their own over-arching analytics of all projects in the DB.

### General User

- Pattern Management
  - Upload Patterns (Unlinked from Ravelry)
    - Name*
    - Difficulty
    - Category (Scarf, Stuffed Animal, etc.)*
    - Description (Optional - low-ish character limit, ~255)
    - Link (Potential File Upload)
    - Related/Linked Yarn
      - Details on each color / weight / yardage / etc. specific to Pattern
    - Related/Linked Tool(s)
    - Misc. Materials (Optional)
      - Stuffing
      - Backing
      - Safety Eyes
      - Handles
      - Etc. (Something to discuss later, maybe this is Project specific not overall "inventory" management)
      - Theses materials are not things we'd search for Patterns off of, but we want associated with Projects to allow for "checklist" type management

  - Search/Add from Raverly
    - By Inventory / Tool(s)
    - By Name / Description
    - *Anything else Ravelry allows that we want from search aspect*
    - Patterns added from Raverly, ultimately are added as a "Project" entity, just like user uploaded patterns
      - But with reference(s) to their Ravelry source

- Project Management
  - Project Details
    - Name
    - Related/Linked Pattern
      - Related/Linked Yarn
      - Related/Linked Tool(s)
    - Status (Todo, In-Progress, Done, Stopped/Hiatus, Dropped/Frogged)
      - Transitioning to various statuses should prompt user on how that effects inventory availability.
    - Date Started
    - Date Finished
    - Date Needed By
  - "Timeline" Milestones
    - Notes, General Updates, Photos, Row Count, "Repeat"
  - General Photo Uploads, not specific to "Timeline"
    - Marquee Photo
    - General Photo Gallery
  - Allow toggles for if Inventory "on-hand" is "reserved"/"claimed" by a project.
  - Allow if "re-usable" tools are fully claimed by a project, or not.
  - Log of when inventory / tools have been added/removed from a project
  - Add / Edit / Delete Projects

- Inventory / Tool Management
  - Bulk Addition
  - Yarn
    - Brand
    - Color
    - Weight
    - Yardage
  - Tools
    - Hook / Needle Type
    - Brand
    - Size
    - Quantity

- Project Analytics / Statistics
  - Overall inventory usage
  - Most used hook / yarn
  - Fastest Project Completed
  - Number of Projects completed
  - Average Time to Complete Project
  - Most completed Pattern
  - Longest Unfinished Project
  - Projects Completed This Year
  - Num of Projects In-Progress / Want-To / Finished

- Account Management
  - Password Reset
  - Forgot Password?
  - Edit Username

### Admin

- View / Edit / Delete Users
  - Manage User Permissions
- View / Edit / Delete Projects (Bulk Delete, maybe edit?)
- View / Add / Edit / Delete Database Entities (i.e Yarn, Materials, Hooks, etc.)
- User Logs
