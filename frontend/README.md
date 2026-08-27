# Frontend

The frontend is a React application served by Vite. During development, Vite
proxies `/api` and `/auth` requests to the backend at
`http://localhost:8080`.

## Start the frontend

From the `frontend` directory, install dependencies and start the development
server:

```sh
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. The [database](../database/README.md)
and [backend](../backend/README.md) must also be running for login and data
features to work.

To stop the development server, press `Ctrl+C` in its terminal.
