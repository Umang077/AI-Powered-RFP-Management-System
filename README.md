# AI-Powered RFP Management System
Built Full-Stack Solution

This project is an end-to-end AI-driven procurement workflow system that:

Converts natural-language RFPs into structured JSON

Manages vendors

Sends RFPs via email

Receives vendor replies using IMAP

Uses AI to parse vendor proposals

Compares proposals and recommends the best vendor

This submission follows the complete requirements of the Aerchain SDE assignment.

## Tech Stack
Frontend

React.js

Axios

CSS / inline styles

Backend

Node.js

Express.js

MongoDB (Mongoose)

Nodemailer (SMTP)

IMAP (node-imap + mailparser)

OpenAI (Response API)

AI Models

gpt-4o-mini (for structured extraction)

## Project Structure

rfp-management-system/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   └── index.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .env.example
└── README.md

## Setup Instructions
### 1. Clone the Repository
git clone https://github.com/yourusername/rfp-management-system.git
cd rfp-management-system

### 2. Backend Setup
cd backend

npm install

Create .env file:

PORT=5000

# MongoDB
MONGO_URI=your_mongo_uri_here

# Gmail (Must use App Password)
EMAIL_USER=example@gmail.com
EMAIL_PASS=your_app_password_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_key_here
Then run:
npm start

Backend runs on:
http://localhost:5000

### 3. Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:
http://localhost:5173

## How to Configure Email (VERY IMPORTANT)
Gmail Requirements

Turn ON IMAP

Use an App Password (NOT regular Gmail password)

Generate app password here:
https://myaccount.google.com/apppasswords

Copy that into .env as:

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=generated_app_password

## API Documentation
### RFP Endpoints
Method	Route	Description
POST	/api/rfp/create	Create structured RFP using AI
POST	/api/rfp/send	Send RFP to selected vendors
### Vendor Endpoints
Method	Route	Description
GET	/api/vendors	Get all vendors
POST	/api/vendors	Add vendor
DELETE	/api/vendors/:id	Remove vendor
### Proposal Endpoints
Method	Route	Description
GET	/api/proposals/rfp/:id	Get proposals for an RFP
### Email / IMAP Endpoints
Method	Route	Description
GET	/api/emails/receive	Reads inbox → AI parses → saves proposals
### Recommendation Endpoints
Method	Route	Description
POST	/api/recommend/:id/recommend	AI analyzes proposals & recommends best vendor
## Design Decisions
### 1. IMAP is Pull-Based

Gmail does not push vendor replies automatically.
To keep it simple and controllable:

Exposed an endpoint /api/emails/receive
Added a "Fetch Vendor Replies" button on UI
Reduced complexity while meeting assignment requirements

Optional for production: cron job / IMAP IDLE.

### 2. AI-Driven Parsing

Two AI parsers were built:

parseRfpText → Converts user input into structured RFP JSON

parseVendorEmail → Extracts proposal values from messy vendor emails

Both use the OpenAI Response API and JSON-only extraction.

### 3. Proposal Scoring

A deterministic scoring function was implemented:

Attribute	Weight
Price	High importance
Delivery Time	Medium
Warranty	Medium
Completeness	Low

This makes comparison consistent without relying on AI alone.

### 4. AI Vendor Recommendation

The system sends:

RFP details

Proposals

Scores

And asks AI:

“Based on these proposals, recommend the best vendor and explain why.”

This gives a business-friendly summary.

## AI Tools Usage
Which AI tools were used?

ChatGPT (OpenAI GPT-4o / GPT-4o-mini)

GitHub Copilot (To create project directory)


What they were used for?

Designing schema structure for RFP, Vendor, Proposal

Creating AI prompt templates for structured JSON extraction

Fixing parsing issues (code fences, formatting, cleaning text)

Improving scoring logic and recommendation API

Readability improvements for README and documentation

Notable prompts or patterns used

“Extract structured JSON from unstructured vendor email”

“Fix OpenAI SDK (responses.create) incompatible version error”

What I learned using these tools:

1. How to structure prompts for JSON-only responses

2. How to debug code related issues
