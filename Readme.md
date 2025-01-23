## Features
- Fetches comments from `https://jsonplaceholder.typicode.com/comments?postId=3`.
- Filters comments based on a keyword provided by the user.
- Implements in-memory caching to reduce API calls (cache duration: 5 minutes).
- Provides real-time search functionality via a front-end interface.
- Includes unit tests for the API using jest and supertest.

## Installation
### Clone this repository:
```bash
git clone https://github.com/Jimmy-Ab/simple-html-site-main
cd simple-html-site-main
```
### Install dependencies:
```bash
npm install
```
## How to Run
Concurrently is set up to run both the backend and frontend simultaneously, allowing you to develop and test them together seamlessly. 

```bash
npm run dev
```
The frontend will run at `http://localhost:3000` and
The server will run at `http://localhost:3001`.

## Testing
### Running Tests
To Run a test for the server:

```bash
cd tests
npx jest index.test.ts
```
### The tests include:

- Filtering comments based on a keyword.
- Returning an empty array if no matching comments are found.
- Handling errors from the third-party API.
- Returning a 400 error if keyword is missing.
- Validating caching functionality.

## Dependencies
### Backend:
- `express`: Server framework.
- `cors`: Middleware for CORS support.
- `node-fetch`: Fetch API for Node.js.
- `jest & supertest`: Testing libraries.

