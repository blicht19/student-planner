# User Stories

---

As a **student**, I want to **create a list of agenda items**, so I can **keep track of the work that I need to complete**.

### Acceptance Criteria

- A form for creating agenda items with a title and an optional description and class and saving them to the database exists in the UI.
- The UI displays a list of upcoming agenda items with a checkbox to mark them completed.
- Clicking the checkbox removes the agenda item from the page.

---

As a **student**, I want to **set a due date on agenda items**, so I can **prioritize work based on how soon it needs to
be
completed**.

### Acceptance Criteria

- The form for creating agenda items includes a field for setting a due date.
- Agenda items are displayed in the order that they are due.

---

As a **student**, I want to **track the time and location of my classes**, so I can **plan my daily schedule**.

### Acceptance Criteria

- A form for creating classes and saving them to the database exists in the UI.
- The form includes fields that indicate the days of the week and time of day that classes meet.
- The form includes a field for the location where classes meet.
- A view with an hour-by-hour schedule that displays classes that meet on a given day exists in the UI.

---

As a **student**, I want to **track the time and location of upcoming events, such as exams**, so I can **plan my daily
schedule**.

### Acceptance Criteria

- A form for creating events and saving them to the database exists in the UI.
- The form includes fields for the time and location of events.
- The hourly schedule view displays events on a given day.

--- 
As a **student**, I want to **see what days on the calendar have classes, events, and due dates for agenda items**, so I
can
**plan my schedule far in advance**.

### Acceptance Criteria

- A view with a monthly calendar exists in the UI.
- The calendar UI displays icons to indicate that classes, events, or due dates for agenda items will occur on that day.
- Clicking on a day on the calendar brings up the hourly schedule and a list of agenda items due on that day.

# Misuser Stories

The ID number of related techniques or mitigations from the MITRE ATT&CK framework are listed in parentheses where
applicable.

As an **attacker**, I want to **access the data of other users**, so I can **acquire sensitive user information**.

### Mitigation Criteria

- Require users to log in and perform authentication via JWT.
- Include user ID as a foreign key on tables. Perform joins on this column so that the data for users other than the one
  who is logged in will not be returned.

---

As an **attacker**, I want to **use cross-site scripting to acquire access tokens stored in local storage, session
storage, or
cookies**, so I can **access another user’s account** (T1189).

### Mitigation Criteria

- Use HttpOnly cookies to store JWTs so they cannot be accessed by javascript.

---

As an **attacker**, I want to **perform SQL injection**, so I can **infiltrate the database** (T1190).

### Mitigation Criteria

- Use libraries on the backend that sanitize user input before it is sent to the database.

---

As an **attacker**, I want to **guess a user’s password via brute force**, so I can **access another user’s account** (
T1110.001)

### Mitigation Criteria

- Set password requirements that follow best practices (M1027).
- Set lockout policies after too many failed login attempts (M1036).

---
As an **unknowing user**, I want to **use a weak password**, so I can **easily remember my password**.

### Mitigation Criteria

- Set password requirements that follow best practices (M1027).
- Properly communicate password requirements to the user in the UI.

---

As an **abusive user**, I want to **use the fields of agenda items and events to store large amounts of data**, so I can
**use the
application for personal cloud storage**.

### Mitigation Criteria

- Set reasonable maximum lengths for fields in the database.
- Perform validation of data lengths on the frontend and the backend.
- Monitor the database to spot excessive usage by a single user.

# Mockup

![mockup](./images/mockup.png)

# C4 Diagrams

## System Context

![system context](./images/student-planner-system-context.png)

## Container

![container](./images/student-planner-container.png)

### Backend REST API Component

![component](./images/backend-rest-api-component.png)