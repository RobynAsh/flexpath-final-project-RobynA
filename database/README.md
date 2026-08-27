# Database

The application uses a MySQL database named `flexpath_final`.

## Set up and seed the database

1. Download and install MySQL Workbench.
2. Open MySQL Workbench and create a connection using the host, port,
   username, and password specified in
   [`application.properties`](../backend/src/main/resources/application.properties).
3. Open [`create-database.sql`](create-database.sql) in MySQL Workbench.
4. Run the entire SQL script to create and seed the `flexpath_final` database.

The script creates the database and tables, then inserts the demo users,
patterns, projects, tags, and milestones used by the application.

> **Warning:** Running the script again drops the application's existing
> tables and recreates them. Any data currently stored in `flexpath_final`
> will be replaced by the seed data.
