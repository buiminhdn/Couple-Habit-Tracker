# Google Sheets Schema

Create one private spreadsheet and share it with the service account email in `GOOGLE_SERVICE_ACCOUNT_EMAIL`.

## Tabs

### people

Header row:

`id,slug,display_name,side,theme_color,avatar_url,created_at`

Seed rows:

`partner,partner,Người ấy,left,lavender,,2026-07-31T00:00:00.000Z`

`me,me,Tôi,right,rose,,2026-07-31T00:00:00.000Z`

### habits

Header row:

`id,person_id,title,is_active,sort_order,created_at,updated_at`

### daily_entries

Header row:

`id,person_id,habit_id,date,is_done,created_at,updated_at`

Logical unique key: `person_id + habit_id + date`.

### daily_closures

Header row:

`id,person_id,date,is_complete,closed_at`

Logical unique key: `person_id + date`.

### penalties

Header row:

`id,person_id,date,amount,reason,created_at`

Logical unique key: `person_id + date`.

### payments

Header row:

`id,person_id,amount,note,paid_at,created_at`
