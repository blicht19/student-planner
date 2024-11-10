# Student Planner

Student Planner is a web application that helps students manage their schedules. It is inspired by the _School Planner_
Android application by Andrea Dal Cin, which can be found on
the [Google Play Store](https://play.google.com/store/apps/details?id=daldev.android.gradehelper&pcampaignid=web_share).

### Planned Features

- **Agenda Management**: Keep track of assignments and other tasks. Set due dates, see which assignments are coming due,
  and check tasks off once they are completed.
- **Class Schedule**: Create a weekly class schedule. Keep track of the day, time, and location of recurring classes as
  well as one-off events or exams. View your hour-by-hour schedule for the day.
- **Calendar**: See at a glance what days of the month have scheduled events or agenda items. Click on a day on the
  calendar to see an hour-by-hour schedule or a list of assignments and tasks that are due on that day.

## Installation

This app runs entirely in docker containers for production
mode. See the [docker docs](https://docs.docker.com/engine/install/) for installation instructions.

```bash
$ docker --version
Docker version 26.0.0, build 2ae903e

$ docker compose version
Docker Compose version v2.26.1-desktop.1
```

Node.js is required to run the app in development mode. Download Node.js [here](https://nodejs.org/en/download/).
Installing Node.js natively is not necessary for production mode.

```bash
$ node -v
v20.17.0

$ npm -v
10.8.2

$ cd student-planner-frontend
$ npm i
```

This project uses just to conveniently save and run build and startup commands. See the installation instructions on
the [just GitHub page](https://github.com/casey/just). Instructions to start the app without just are documented as
well.

```bash
$ just --version
just 1.36.0
```

## Getting Started

### Starting in Development Mode

```bash
# With just
$ just start-dev

# Without just
# Start containers for the database, backend, and pgadmin.
$ docker compose -f dev.yml up --build -d
# Start the frontend
$ cd student-planner-frontend
$ npm i
$ npm run dev
```

### Starting in Production Mode

```bash
# With just
$ just start-prod

# Without just
$ docker compose -f prod.yml up --build -d
```

Once started, the application will be deployed at http://localhost:3000. The application currently consists of a
prototype of the authentication functionality.

# License

MIT License

Copyright (c) 2024 Bailey Licht

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
