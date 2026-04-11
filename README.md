# WanderLust

WanderLust is a full-stack travel listing web app inspired by Airbnb. Users can browse stays, sign up, log in, create their own listings, and leave reviews on listing pages.

The project is built with Node.js, Express, MongoDB, EJS, Passport.js, and Bootstrap. It uses server-rendered views and stores data in a local MongoDB database.

## Features

- Browse all travel listings
- View detailed pages for each listing
- User signup, login, and logout
- Create new listings after logging in
- Edit and delete listings as the listing owner
- Add and delete reviews
- Flash messages for user feedback
- Session-based authentication with Passport
- Sample listing data for local development

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- EJS + `ejs-mate`
- Passport.js + `passport-local`
- `passport-local-mongoose`
- Joi
- Bootstrap 5
- Font Awesome

## Project Structure

```text
.
├── app.js
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
├── utils/
│   ├── expressError.js
│   └── wrapAsync.js
└── views/
    ├── includes/
    ├── layouts/
    ├── listing/
    └── users/
```

## Local Setup

### Prerequisites

- Node.js and npm
- MongoDB running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

This project connects to the following local database by default:

```text
mongodb://127.0.0.1:27017/wanderlust
```

Make sure your MongoDB server is running before starting the app.

### 3. Optional: seed sample listings

```bash
node init/index.js
```



### 4. Start the server

```bash
node app.js
```

The app runs at:

```text
http://localhost:3000
```

The main listing interface is available at:

```text
http://localhost:3000/listing
```

## Main Routes

### Root

- `GET /` - simple root check route

### Auth

- `GET /signup` - signup page
- `POST /signup` - create a new user
- `GET /login` - login page
- `POST /login` - authenticate user
- `GET /logout` - logout current user

### Listings

- `GET /listing` - show all listings
- `GET /listing/new` - new listing form
- `POST /listing` - create listing
- `GET /listing/:id` - show listing details
- `GET /listing/:id/edit` - edit listing form
- `PUT /listing/:id` - update listing
- `DELETE /listing/:id` - delete listing

### Reviews

- `POST /listing/:id/review` - create review for a listing
- `DELETE /listing/:id/review/:reviewId` - delete a review

## Data Models

### User

Defined in [`models/user.js`](/home/blackarch/Documents/DEVLOPMENT/Major_projects/models/user.js)

- `email`
- `username` and password fields managed by `passport-local-mongoose`

### Listing

Defined in [`models/listing.js`](/home/blackarch/Documents/DEVLOPMENT/Major_projects/models/listing.js)

- `title`
- `description`
- `image`
- `price`
- `location`
- `country`
- `owner`
- `reviews`

Listings also delete their related reviews through a Mongoose post-delete hook.

### Review

Defined in [`models/review.js`](/home/blackarch/Documents/DEVLOPMENT/Major_projects/models/review.js)

- `comment`
- `rating`
- `createdAt`

## Authentication and Authorization

- Passport local authentication is configured in [`app.js`](/home/blackarch/Documents/DEVLOPMENT/Major_projects/app.js).
- Logged-in users can access the add-listing page.
- Listing owners can edit and delete only their own listings.
- Users are redirected back to the protected page they originally tried to access after logging in.

## Validation

- Review validation uses Joi in [`Schema.js`](/home/blackarch/Documents/DEVLOPMENT/Major_projects/Schema.js).
- Client-side form validation is handled in [`public/js/script.js`](/home/blackarch/Documents/DEVLOPMENT/Major_projects/public/js/script.js).

## Current Limitations

- The MongoDB connection string and session secret are hardcoded in [`app.js`](/home/blackarch/Documents/DEVLOPMENT/Major_projects/app.js).
- The seed script depends on a hardcoded owner id.
- `POST /listing` uses `req.user` but is not protected by `isLoggedIn`, so direct unauthenticated requests can fail.
- Review creation and deletion are not protected by authentication or ownership checks.
- There are no automated tests yet.
- The root route is only a simple text response; the actual app experience starts at `/listing`

## Future Improvements

- Move secrets and database configuration to environment variables
- Add authorization checks for review actions
- Protect all write routes consistently
- Add custom error pages
- Add automated tests
- Support image uploads instead of URL-only images

## License

This project is currently shared for learning and portfolio use. 
