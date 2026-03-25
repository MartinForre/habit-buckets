# Habit Buckets Tracker — Requirements (MVP)

## 1. Overview

A simple habit tracker built around **3 daily buckets**:

* 🟢 Body (move your body)
* 🟢 Life (move your life forward)
* 🟢 People (connect with others)

The goal is to **complete at least one activity per bucket per day**, with flexibility in how each bucket is fulfilled.

The app should feel:

* fast
* minimal
* frictionless
* mobile-first (PWA)

---

## 2. Goals

* Reduce overthinking → focus on *daily wins*
* Encourage balance across life areas
* Avoid rigid habit systems
* Work well on phone (installed as PWA)

---

## 3. Tech Stack

* **Frontend:** Next.js (App Router)
* **UI:** shadcn/ui + Tailwind
* **Backend/DB/Auth:** Supabase
* **Hosting:** Vercel
* **PWA:** Yes (installable on mobile)

---

## 4. Core Concepts

### 4.1 Buckets

Default:

* Body
* Life
* People

User can:

* rename buckets
* add/remove buckets (future enhancement, optional for MVP)

---

### 4.2 Activities (Habits)

An activity:

* belongs to 1+ buckets
* is something the user can complete

Examples:

* “Gym” → Body
* “Work on project” → Life
* “Call a friend” → People
* “Disc golf with friends” → Body + People

---

### 4.3 Daily Completion

Each day:

* user completes activities
* each completed activity fills 1+ buckets
* bucket is considered **complete if ≥1 activity done**

---

## 5. Functional Requirements

### 5.1 Authentication

* Email/password (Supabase Auth)
* Persist session
* Auto-login

---

### 5.2 Dashboard (Main Screen)

**This is the core UI**

Display:

* Today’s date

* List of buckets:

    * Name
    * Completion status (complete / incomplete)
    * Visual indicator (color, icon, progress)

* List of activities:

    * Checkbox/toggle per activity
    * Shows which buckets it affects

---

### 5.3 Activity Completion

User can:

* tap activity → mark complete
* tap again → unmark

When completed:

* update all related buckets
* persist immediately

---

### 5.4 Bucket Completion Logic

A bucket is:

* ✅ Complete → if ≥1 linked activity completed today
* ❌ Incomplete → otherwise

---

### 5.5 Add / Edit Activities

User can:

* create activity:

    * name
    * select 1+ buckets

* edit activity:

    * name
    * bucket mapping

* delete activity

---

### 5.6 Daily Reset

* Activities reset every day
* Completion is tracked per date

---

### 5.7 History (Simple MVP)

User can:

* view previous days
* see:

    * which buckets were completed
    * which activities were done

(Simple list view is enough)

---

## 6. UI / UX Requirements

### 6.1 Design Principles

* Minimal
* Large tap targets
* Fast interactions
* No clutter
* Mobile-first

---

### 6.2 Dashboard Layout (Mobile)

**Top:**

* Date
* Optional streak indicator

**Middle: Buckets**

```
[ Body   ✅ ]
[ Life   ❌ ]
[ People ✅ ]
```

**Bottom: Activities**

```
[ ] Gym                  (Body)
[ ] Work on project      (Life)
[ ] Call friend          (People)
[ ] Disc golf            (Body, People)
```

---

### 6.3 Interactions

* Tap = toggle
* Immediate visual feedback
* No “save” button

---

### 6.4 States

* Completed bucket → green
* Incomplete → neutral/gray
* Empty state → prompt to add activities

---

## 7. Data Model (Supabase)

### users

Handled by Supabase Auth

---

### buckets

```
id (uuid)
user_id (uuid)
name (text)
created_at
```

---

### activities

```
id (uuid)
user_id (uuid)
name (text)
created_at
```

---

### activity_buckets (many-to-many)

```
id
activity_id
bucket_id
```

---

### activity_logs (daily completion)

```
id
user_id
activity_id
date (date)
completed (boolean)
```

---

## 8. PWA Requirements

* Installable on iOS/Android
* App icon
* Splash screen
* Works like native app
* Basic offline support (optional MVP)

---

## 9. Hosting & Deployment

* Vercel for frontend
* Supabase for backend
* Env vars:

    * Supabase URL
    * Supabase anon key

---

## 10. Acceptance Criteria (MVP)

* User can log in
* User sees buckets + activities
* User can toggle activities
* Buckets update instantly
* State persists per day
* Works on mobile as PWA
* No noticeable friction

---

## 11. Usage Examples

### Example 1 — Normal day

* Gym → Body ✅
* Work on side project → Life ✅
* Call friend → People ✅

→ All buckets complete

---

### Example 2 — Efficient day

* Disc golf with friends

→ Body ✅
→ People ✅

Then:

* 20 min project work

→ Life ✅

---

### Example 3 — Low energy day

* 10 min walk → Body ✅
* Send 1 message → People ✅
* 10 min planning → Life ✅

→ Still a win

---

### Example 4 — Bad day (partial)

* Only watched Netflix

→ No buckets complete

Next day:
→ clean slate (no punishment)

---

## 12. Non-Goals (MVP)

* No complex analytics
* No gamification
* No social features
* No reminders/notifications (optional later)

---

## 13. Future Enhancements

* Streak tracking
* Weekly summaries
* Custom bucket count
* Smart suggestions (AI)
* Widgets (mobile)
* Notifications
* Offline-first sync
* “Low energy mode” suggestions

---

## 14. Guiding Principle

> The app should make it easier to act, not think.

If anything adds friction → cut it.

---