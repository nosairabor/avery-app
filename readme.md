# Cash Flow Tracker - Avery

A Node.js API with PostgreSQL database and Google Apps Script integration for tracking cash flow in Google Sheets.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup Instructions](#setup-instructions)
  - [1. Run the Node.js API](#1-run-the-nodejs-api)
  - [2. Attach Apps Script to Google Sheet](#2-attach-apps-script-to-google-sheet)
  - [3. Test the Workflow](#3-test-the-workflow)
- [API Endpoints](#api-endpoints)
- [Notes](#notes)

## Overview

This project provides a complete cash flow tracking solution that combines:
- **Node.js API** - Backend server for handling transactions
- **PostgreSQL Database** - Data storage
- **Google Apps Script** - Integration with Google Sheets for real-time updates

## Prerequisites

Before getting started, ensure you have:
- [Node.js](https://nodejs.org/) installed on your system
- PostgreSQL database set up
- Google account with access to Google Sheets
- [Google Apps Script CLI (clasp)](https://github.com/google/clasp) installed globally:
  ```bash
  npm install -g @google/clasp
  ```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nosairabor/avery-app
   cd <YOUR_PROJECT_FOLDER>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Setup Instructions

### 1. Run the Node.js API

1. Start the server:
   ```bash
   node index.js
   ```

2. Verify the API is running at:
   ```
   http://localhost:3000
   ```

### 2. Attach Apps Script to Google Sheet

1. Open your Google Sheet in the browser and copy the Sheet ID from the URL:
  

2. Login to Google Apps Script CLI:
   ```bash
   clasp login
   ```

3. Create and bind the script to your sheet:
   ```bash
   clasp create --type sheets --title "Cash Flow Script" --parentId SPREADSHEET_ID
   ```

   This will:
   - Bind the script to your Google Sheet
   - Generate an `appsscript.json` manifest file

### 3. Test the Workflow

#### Local Testing
Send a GET request to test the local API:
```bash
curl http://localhost:3000/transactions
```

#### Production Testing
Alternatively, test using the live endpoint:
```bash
curl https://avery-app-ai.onrender.com/transactions
```

#### Verify Google Sheets Integration
1. Check that your Google Sheet updates correctly
2. Ensure the attached Apps Script is functioning properly

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Retrieve all transactions |

## Notes

- **Order matters**: Follow the setup steps in sequence:
  1. Run API → 2. Attach script → 3. Test workflow
- Ensure Node.js version is compatible with the project requirements
- Make sure `clasp` is logged into your Google account before attaching the script
- The Google Apps Script will automatically sync data between the API and your Google Sheet

