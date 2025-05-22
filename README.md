# Hostclub

This project now separates the React front‑end and a simple Express back‑end.

## Frontend
The existing React application lives at the repository root.

Run it with:

```bash
npm install
npm run dev
```

## Backend
Backend code is under the `server/` directory.

```bash
cd server
npm install
npm start
```

The backend manages store information stored in `server/data/stores.json` and exposes REST endpoints:

- `GET /stores` – list stores
- `POST /stores` – create a store
- `GET /stores/:id` – fetch a store
- `PUT /stores/:id` – update a store
- `DELETE /stores/:id` – delete a store

Feel free to adjust details as needed.
