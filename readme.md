# Cash Flow Tracker - Avery

A Node.js API with PostgreSQL database and Google Apps Script integration for tracking cash flow in Google Sheets.

## Overview

This project demonstrates a complete cash flow tracking solution with:
- **Node.js API** - Backend server handling transactions
- **PostgreSQL Database** - Hosted data storage  
- **Google Apps Script** - Real-time Google Sheets integration

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- Google account with Google Sheets access
- [Google Apps Script CLI (clasp)](https://github.com/google/clasp):
  ```bash
  npm install -g @google/clasp
  ```

## Installation

```bash
git clone https://github.com/nosairabor/avery-app
cd avery-app
npm install
```

## Instructions

### Run the Node.js API

Start the local server:
```bash
node index.js
```

The API will be available at `http://localhost:3000`

### Attach the Apps Script to a Google Sheet

1. Open your Google Sheet and copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

2. Login and create the Apps Script:
   ```bash
   clasp login
   clasp create --type sheets --title "Cash Flow Script" --parentId SHEET_ID_HERE
   ```

### Test the Workflow

Test the API endpoints on Postman or a browser:
- **Local**: `http://localhost:3000/transactions`
- **Live**: `https://avery-app-ai.onrender.com/transactions`

Verify that your Google Sheet updates automatically when transactions are retrieved.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Retrieve all transactions |

## Notes

- Follow setup steps in order: API → Apps Script → Test
- Ensure `clasp` is logged into your Google account
- The Apps Script automatically syncs data between API and Google Sheets