# RF Management System — Backend

This folder contains the backend for the RF Management System (Express + Node + MongoDB).

## Quick start

1. Install dependencies

```powershell
cd backend
npm install
```

2. Create environment variables

- Copy `.env.example` (or edit `.env`) and fill the values. Example keys are listed below.

3. Run the server

```powershell
# basic run
node index.js

# or add a start script in package.json:
# "start": "node index.js"
# then run:
# npm run start
```

## Environment variables

Required (replace with your values):

- `PORT` — port to run the server (default: 5000)
- `MONGODB_URI` — MongoDB connection URI
- `JWT_SECRET` — JWT signing secret
- `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS` — SMTP settings for sending emails
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `S3_BUCKET` — optional S3 uploads
- `OPENAI_API_KEY` — optional (for AI service)
- `REDIS_URL` — optional Redis connection
- `NODE_ENV` — `development` or `production`

## Notes

- `.env` is ignored by `.gitignore` to prevent committing secrets.
- Update `package.json` scripts with a `start` script if you prefer `npm run start`.
- If you want, I can create a `.env.example` file and add a `start` script to `package.json` now.
