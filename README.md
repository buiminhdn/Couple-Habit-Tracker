# Couple Habit PWA

Private mobile-first PWA for two people to track daily habits and penalty payments.

## Setup

1. Create a private Google Sheet.
2. Create the tabs and headers from `docs/google-sheets-schema.md`.
3. Copy `.env.example` to `.env`.
4. Fill `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`.
5. Share the spreadsheet with the service account email.
6. Run `npm install`.
7. Run `npm run dev`.

If Google Sheets credentials are missing, the app still opens with demo data so the UI can be reviewed locally.

## Scripts

- `npm run dev`
- `npm run build`
- `npm test`
- `npm run start`
