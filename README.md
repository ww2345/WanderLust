# WanderLust

Airbnb-style listings + reviews app built with **Node.js + Express + MongoDB + EJS**.

This is a learning/practice project (server-rendered, no auth yet).

## Features

- Listings CRUD (create / view / edit / delete)
- Ratings + reviews (create + delete)
- Server-rendered UI with EJS + `ejs-mate` layouts
- Bootstrap 5 UI + custom CSS
- Client-side form validation with Bootstrap
- Server-side review validation with Joi
- Cascade delete: deleting a listing deletes its reviews

## Tech Stack

- Node.js (CommonJS)
- Express
- MongoDB + Mongoose
- EJS + ejs-mate
- Joi (validation)
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

### Listings

- `GET /` – health check
- `GET /listing` – all listings
- `GET /listing/new` – create form
- `POST /listing` – create
- `GET /listing/:id` – show listing + reviews
- `GET /listing/:id/edit` – edit form
- `PUT /listing/:id` – update (via `?_method=PUT`)
- `DELETE /listing/:id` – delete (via `?_method=DELETE`)

### Reviews

- `POST /listing/:id/review` – add review (validated with Joi)
- `DELETE /listing/:id/review/:reviewId` – delete review (via `?_method=delete`)

## Data Model (Mongoose)

- `Listing` (`models/listing.js`)
  - `title` (required), `description`, `price`, `location`, `country`, `image`
  - `reviews`: array of `ObjectId` references to `Review`
- `Review` (`models/review.js`)
  - `rating` (1–5), `comment`, `createdAt`

When a listing is deleted with `findByIdAndDelete`, a `post("findOneAndDelete")` hook removes all referenced reviews.

## Project Structure

- `app.js` – Express app + routes
- `models/listing.js` – Mongoose `Listing` schema
- `models/review.js` – Mongoose `Review` schema
- `init/` – seed script + sample data
- `Schema.js` – Joi schemas (server-side validation)
- `utils/` – helpers (`wrapAsync`, `expressError`)
- `views/` – EJS templates + layout + partials
- `public/` – static assets (CSS)
- `public/js/script.js` – Bootstrap form validation helper

## Notes / Limitations

- No authentication/authorization yet (anyone can add/delete reviews).
- Error responses are simple text (no dedicated error pages yet).
