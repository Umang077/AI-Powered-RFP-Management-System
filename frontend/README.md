# AI-Powered RFP Management System Full-Stack Solution

This project is an end-to-end AI-driven procurement workflow system that:

Converts natural-language RFPs into structured JSON

Manages vendors

Sends RFPs via email

Receives vendor replies using IMAP

Uses AI to parse vendor proposals

Compares proposals and recommends the best vendor


## 🔧 Tech Stack
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

### 3. Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:
👉 http://localhost:5173

## ✨ How to Configure Email (VERY IMPORTANT)
Gmail Requirements

Turn ON IMAP

Use an App Password (NOT regular Gmail password)

Generate app password here:
👉 https://myaccount.google.com/apppasswords

Copy that into .env as:

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=generated_app_password

## 🔍 API Documentation
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
## 🧠 Design Decisions
### 1. IMAP is Pull-Based

Gmail does not push vendor replies automatically.


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
