# LIRR Train Tracker

## Overview
The LIRR Train Tracker is a Node.js application powered by Playwright.js, designed to automate the collection of train track numbers for specified Long Island Rail Road (LIRR) trains. It scrapes the LIRR official website for real-time train track information and stores this data in a Google Sheet for easy access and analysis.

## Features
- Automated scraping of LIRR train track numbers
- Real-time updates and storage in Google Sheets
- Easy configuration for tracking specific trains

## Prerequisites
Before you can run the LIRR Train Tracker, you'll need to have the following installed on your system:
- Node.js (v12 or higher)
- npm (Node Package Manager)

Additionally, you'll need:
- A Google Cloud Platform account with the Sheets API enabled
- Credentials for a Google Service Account with permission to edit your target Google Sheet

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/hellsalve017196/LirrTrainTracker.git
    cd LirrTrainTracker
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up your environment variables**
   
    Rename the `.env.example` file to `.env` and update it with your Google Service Account credentials and the ID of your target Google Sheet.

## Usage

To start the LIRR Train Tracker, run:

```bash
node app.js
