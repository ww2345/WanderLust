# WanderLust

Simple Airbnb-style listings app built with **Node.js + Express + MongoDB + EJS**.

## Features

- Create / view / update / delete listings
- Server-rendered UI with EJS + `ejs-mate` layouts
- `method-override` support for `PUT` and `DELETE` from HTML forms

## Tech Stack

- Node.js (CommonJS)
- Express
- MongoDB + Mongoose
- EJS + ejs-mate
- Bootstrap 5 + Font Awesome (CDN)

## Getting Started (Local)

### 1) Install dependencies

```bash
npm install
```

### 2) Start MongoDB

This project connects to:

```text
mongodb://127.0.0.1:27017/wanderlust
```

Make sure MongoDB is running locally.

### 3) (Optional) Seed sample listings

```bash
node init/index.js
```

### 4) Run the server

```bash
node app.js
```

Open:

```text
http://localhost:3000/listing
```

## Routes

- `GET /` – health check (“root is working”)
- `GET /listing` – all listings
- `GET /listing/new` – create form
- `POST /listing` – create
- `GET /listing/:id` – show listing
- `GET /listing/:id/edit` – edit form
- `PUT /listing/:id` – update (via `?_method=PUT`)
- `DELETE /listing/:id` – delete (via `?_method=DELETE`)

## Project Structure

- `app.js` – Express app + routes
- `models/listing.js` – Mongoose `Listing` schema
- `init/` – seed script + sample data
- `views/` – EJS templates + layout + partials
- `public/` – static assets (CSS)



## Still in devloping stage 