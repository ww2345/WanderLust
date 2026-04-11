# WanderLust

WanderLust is a full-stack travel listing app inspired by Airbnb-style browsing. It lets people explore stays, search by place or keyword, filter by category, sign up, log in, create their own listings, upload images, and leave reviews.

The project is built with Node.js, Express, MongoDB, EJS, Passport, Bootstrap, and Cloudinary. It uses server-rendered pages, session-based authentication, and a local MongoDB database during development.

## What You Can Do

- Browse all listings from the main `/listing` page
- Search stays by title, description, location, country, or category
- Filter listings by categories like mountain, arctic, beach, city, forest, castle, and desert
- Open a listing details page with reviews and owner information
- Sign up, log in, and log out with Passport authentication
- Create new listings after logging in
- Edit or delete only the listings you own
- Add reviews when logged in and delete only your own reviews
- Upload listing images through Cloudinary or use an image URL
- Seed the database with sample travel listings for local development

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- EJS
- `ejs-mate`
- Passport.js
- `passport-local`
- `passport-local-mongoose`
- `express-session`
- `connect-flash`
- Joi
- Multer
- Cloudinary
- `multer-storage-cloudinary`
- Bootstrap 5
- Font Awesome

## Project Structure

```text
.
├── app.js
├── cloudConfig.js
├── middleware.js
├── Schema.js
├── init/
│   ├── data.js
│   └── index.js
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/
│   ├── css/
│   └── js/
├── routes/
│   ├── listings.js
│   ├── reviews.js
│   ├── root.js
│   └── user.js
├── uploads/
├── utils/
│   ├── expressError.js
│   ├── listingCategories.js
│   └── wrapAsync.js
└── views/
    ├── includes/
    ├── layouts/
    ├── listing/
    └── users/
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB running locally
- A Cloudinary account if you want image uploads

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Add your Cloudinary credentials:

```env
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
```

### 3. Start MongoDB

This app connects to a local database at:

```text
mongodb://127.0.0.1:27017/wanderlust
```

### 4. Seed sample data (optional)

```bash
node init/index.js
```

### 5. Start the app

```bash
node app.js
```

Open the app at:

```text
http://localhost:3000
```

The root route redirects to:

```text
http://localhost:3000/listing
```

## Main Routes

### Root

- `GET /` redirects to `/listing`

### Auth

- `GET /signup` render the signup form
- `POST /signup` register a new user
- `GET /login` render the login form
- `POST /login` authenticate a user
- `GET /logout` log out the current user

### Listings

- `GET /listing` show all listings
- `GET /listing?category=beach` filter listings by category
- `GET /listing?q=tokyo` search listings
- `GET /listing?category=mountain&q=aspen` combine filter and search
- `GET /listing/new` render the new listing form
- `POST /listing` create a listing
- `GET /listing/:id` show one listing
- `GET /listing/:id/edit` render the edit form
- `PUT /listing/:id` update a listing
- `DELETE /listing/:id` delete a listing

### Reviews

- `POST /listing/:id/review` create a review for a listing
- `DELETE /listing/:id/review/:reviewId` delete a review

## Data Models

### User

The `User` model stores:

- `email`
- `username`
- password fields managed by `passport-local-mongoose`

### Listing

The `Listing` model stores:

- `title`
- `description`
- `image.url`
- `image.filename`
- `price`
- `location`
- `country`
- `category`
- `owner`
- `reviews`

Listings also clean up their related reviews when a listing is deleted.

### Review

The `Review` model stores:

- `comment`
- `rating`
- `createdAt`
- `author`

## A Quick Walkthrough

- `app.js` wires together Express, MongoDB, sessions, flash messages, Passport, and the route files.
- `controllers/listing.js` handles listing search, category filtering, create, edit, show, and delete actions.
- `utils/listingCategories.js` keeps the filter categories and category-matching logic in one place.
- `cloudConfig.js` connects Multer uploads to Cloudinary storage.
- `middleware.js` protects routes, checks ownership, and handles redirect-after-login behavior.
- `public/js/script.js` adds Bootstrap-style client-side form validation.

## Interface Highlights

- The navbar includes a live search form that submits to the listings page.
- The listings page includes category chips with Font Awesome icons.
- Search and category filters work together, so users can narrow results in one flow.
- New and edit listing forms support both image URLs and file uploads.

## Running The Project

If you just want the shortest path:

```bash
npm install
node init/index.js
node app.js
```

Then visit `http://localhost:3000/listing`.

## License

This project is shared for learning and portfolio use.
