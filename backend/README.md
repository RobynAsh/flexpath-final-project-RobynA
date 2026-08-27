# Backend

The backend is a Java 17 Spring Boot REST API. It runs on port `8080` by
default and connects to the local MySQL database named `flexpath_final`.

## Configure the database connection

The connection settings are in
`src/main/resources/application.properties`. The checked-in defaults are:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/flexpath_final
spring.datasource.username=root
spring.datasource.password=password
```

Update the username or password for your local MySQL installation if needed.
Make sure the database has been [created and seeded](../database/README.md)
before starting the API.

## Start the backend

From the `backend` directory, run:

```sh
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`. To stop it, press
`Ctrl+C` in its terminal.
