# Settings Documentation

## 1. General — Admin Profile

| Field | Storage | What it does |
|-------|---------|-------------|
| **Full Name** | `users.full_name` | Your display name across the admin panel |
| **Email** | `users.email` | Your login email (read-only) |
| **Phone Number** | `users.phone_number` | Contact number shown on adoption/rescue communications |
| **Address** | `users.address` | Office address used in correspondence |

**API:** `GET/PATCH /api/admin/settings/profile`

---

## 2. Notifications

Each toggle controls whether you receive **in-app notifications** (the bell icon in the admin header + the notification list page) for that event type. Turning a toggle **OFF** means the system will **skip creating** that notification entirely for your admin account.

| Toggle | Trigger event |
|--------|---------------|
| **Adoption Status Changes** | An adoption application is approved, rejected, or another applicant's pet becomes unavailable |
| **Report Status Changes** | A rescue report's status changes (acknowledged, dispatched, resolved) |
| **New Messages** | A resident sends a message in a conversation thread |
| **New Rescue Reports** | A citizen submits a new animal rescue report |
| **Community Listings** | A resident posts a new community pet listing |
| **New Applications** | A resident submits an adoption application |

**Storage:** `notification_preferences` table (per-admin, per-type)
**API:** `GET/PATCH /api/admin/settings/notification-preferences`
**Enforcement:** `notificationService.create()` checks `in_app_enabled` before inserting — if disabled, the notification is discarded.

---

## 3. Maps

| Setting | Storage key | What it does |
|---------|-------------|-------------|
| **Default Map Location** | `map_location` | The initial center point when the analytics heatmap page loads |
| ~~Default Map Zoom Level~~ | *(removed)* | |
| **Enable Heatmap** | `enable_heatmap` | Shows/hides the heatmap overlay on the Geographic analytics section |

---

## 4. E-Learning

| Setting | Storage key | What it does |
|---------|-------------|-------------|
| **Module Visibility** | `module_visibility` | Default access level when creating new learning modules (public / volunteers / restricted) |
| **Allow Quiz Retakes** | `allow_quiz_retakes` | How many times a resident can retake quizzes (always / limited / once) |
| **Enable Certificates** | `enable_certificates` | Whether a certificate is issued upon module completion |
| **Enable Module Reviews** | `enable_reviews` | Whether residents can leave feedback on modules |

---

## 5. System

| Setting | Storage key | What it does |
|---------|-------------|-------------|
| **Date Format** | `date_format` | Date display format across exports and reports |
| **Time Format** | `time_format` | 12-hour or 24-hour clock in timestamps |
| **Time Zone** | `time_zone` | Base time zone for scheduling and logs |

---

## 6. Security

| Setting | Storage | What it does |
|---------|---------|-------------|
| **Change Password** | `users.password_hash` | Updates your admin login password (requires current password, min 8 characters). Validates current password via bcrypt before hashing the new one. |
| **Session Timeout** | `app_settings.session_timeout` | How long before auto-logout due to inactivity (UI preference — actual enforcement is via JWT token expiry on the backend) |
| **Enable Two-Factor Authentication** | `app_settings.enable_2fa` | Placeholder — 2FA is not yet implemented |
| **Require Strong Passwords** | `app_settings.require_strong_passwords` | Placeholder — password complexity rules are not yet enforced |

**Password API:** `PUT /api/admin/settings/password`

---

## Storage

All settings are persisted in the database:

| Store | Table | Scope |
|-------|-------|-------|
| Admin Profile | `users` | Per-admin (identified by JWT) |
| Notification Preferences | `notification_preferences` | Per-admin, per-notification-type |
| All other settings | `app_settings` | Global key-value store (same for all admins) |

**Migration:** If the `app_settings` table is missing, run:
```sql
mysql -u root -p your_db < backend/database/migration_add_app_settings.sql
```
