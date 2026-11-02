import { Task } from "../routers/tasks.router";

export const taskData: Task[] = [
  {
    id: 1,
    title: "Set up project repository",
    description:
      "Create the Git repository, add a README, and configure the main branch protection rules.",
    createdAt: "2026-10-01T09:00:00-03:00",
  },
  {
    id: 2,
    title: "Configure TypeScript and ESLint",
    description:
      "Add tsconfig.json with strict mode and set up ESLint with Prettier for consistent code style.",
    createdAt: "2026-10-02T10:15:00-03:00",
  },
  {
    id: 3,
    title: "Design database schema",
    description:
      "Draft the entity relationship diagram for users, projects, and tasks, and review it with the team.",
    createdAt: "2026-10-03T11:30:00-03:00",
  },
  {
    id: 4,
    title: "Implement user authentication",
    description:
      "Build sign up, login, and logout flows using JWT with refresh token rotation.",
    createdAt: "2026-10-04T08:45:00-03:00",
  },
  {
    id: 5,
    title: "Add password reset flow",
    description:
      "Send a reset link by email with an expiring token and a page to set a new password.",
    createdAt: "2026-10-05T14:20:00-03:00",
  },
  {
    id: 6,
    title: "Create task CRUD endpoints",
    description:
      "Implement REST endpoints to create, read, update, and delete tasks with input validation.",
    createdAt: "2026-10-06T09:30:00-03:00",
  },
  {
    id: 7,
    title: "Write API documentation",
    description:
      "Document all endpoints with OpenAPI/Swagger, including request and response examples.",
    createdAt: "2026-10-07T13:00:00-03:00",
  },
  {
    id: 8,
    title: "Build task list component",
    description:
      "Create a responsive React component that renders the list of tasks with loading and empty states.",
    createdAt: "2026-10-08T10:00:00-03:00",
  },
  {
    id: 9,
    title: "Add task creation form",
    description:
      "Build a form with client-side validation for title and description, including error messages.",
    createdAt: "2026-10-09T15:10:00-03:00",
  },
  {
    id: 10,
    title: "Implement task filtering",
    description:
      "Allow filtering tasks by status, creation date, and keyword in the title or description.",
    createdAt: "2026-10-10T09:20:00-03:00",
  },
  {
    id: 11,
    title: "Add pagination support",
    description:
      "Support cursor-based pagination on the API and infinite scroll on the task list.",
    createdAt: "2026-10-11T11:45:00-03:00",
  },
  {
    id: 12,
    title: "Set up unit testing framework",
    description:
      "Configure Vitest and add a first set of tests for utility functions and validators.",
    createdAt: "2026-10-12T08:30:00-03:00",
  },
  {
    id: 13,
    title: "Write integration tests for API",
    description:
      "Cover the main endpoints with integration tests running against a test database.",
    createdAt: "2026-10-13T14:00:00-03:00",
  },
  {
    id: 14,
    title: "Configure CI pipeline",
    description:
      "Set up GitHub Actions to run linting, type checks, and tests on every pull request.",
    createdAt: "2026-10-14T10:40:00-03:00",
  },
  {
    id: 15,
    title: "Add dark mode support",
    description:
      "Implement a theme toggle using CSS variables and persist the preference per user.",
    createdAt: "2026-10-15T16:00:00-03:00",
  },
  {
    id: 16,
    title: "Implement drag and drop reordering",
    description:
      "Let users reorder tasks via drag and drop and persist the new order on the server.",
    createdAt: "2026-10-16T09:10:00-03:00",
  },
  {
    id: 17,
    title: "Add due dates and reminders",
    description:
      "Extend the task model with a due date and send email reminders 24 hours before the deadline.",
    createdAt: "2026-10-17T13:25:00-03:00",
  },
  {
    id: 18,
    title: "Create user profile page",
    description:
      "Show account details and allow users to update their name, avatar, and notification settings.",
    createdAt: "2026-10-18T10:50:00-03:00",
  },
  {
    id: 19,
    title: "Implement role-based access control",
    description:
      "Introduce admin, member, and viewer roles with permission checks on protected routes.",
    createdAt: "2026-10-19T11:15:00-03:00",
  },
  {
    id: 20,
    title: "Add task comments",
    description:
      "Allow users to leave comments on tasks and display them in chronological order.",
    createdAt: "2026-10-20T15:30:00-03:00",
  },
  {
    id: 21,
    title: "Support file attachments",
    description:
      "Enable uploading files to tasks, with size limits and type validation, stored in object storage.",
    createdAt: "2026-10-21T09:00:00-03:00",
  },
  {
    id: 22,
    title: "Implement real-time updates",
    description:
      "Use WebSockets to push task changes to connected clients without a page refresh.",
    createdAt: "2026-10-22T14:40:00-03:00",
  },
  {
    id: 23,
    title: "Add rate limiting",
    description:
      "Protect the API from abuse by applying per-IP and per-user rate limits on sensitive endpoints.",
    createdAt: "2026-10-23T10:20:00-03:00",
  },
  {
    id: 24,
    title: "Set up error monitoring",
    description:
      "Integrate Sentry on the frontend and backend to capture and alert on unhandled errors.",
    createdAt: "2026-10-24T08:55:00-03:00",
  },
  {
    id: 25,
    title: "Improve accessibility",
    description:
      "Audit the UI for keyboard navigation, ARIA labels, and color contrast, then fix the issues found.",
    createdAt: "2026-10-25T16:15:00-03:00",
  },
  {
    id: 26,
    title: "Add internationalization",
    description:
      "Set up i18n with English and Brazilian Portuguese translations and a language selector.",
    createdAt: "2026-10-26T11:00:00-03:00",
  },
  {
    id: 27,
    title: "Optimize database queries",
    description:
      "Profile slow queries, add missing indexes, and eliminate N+1 queries in list endpoints.",
    createdAt: "2026-10-27T09:35:00-03:00",
  },
  {
    id: 28,
    title: "Implement data export",
    description:
      "Let users export their tasks as CSV or JSON from the settings page.",
    createdAt: "2026-10-27T14:10:00-03:00",
  },
  {
    id: 29,
    title: "Create onboarding tour",
    description:
      "Add a short guided walkthrough for new users highlighting the main features.",
    createdAt: "2026-10-28T10:30:00-03:00",
  },
  {
    id: 30,
    title: "Set up staging environment",
    description:
      "Provision a staging environment that mirrors production and deploy automatically from the develop branch.",
    createdAt: "2026-10-28T15:45:00-03:00",
  },
  {
    id: 31,
    title: "Add end-to-end tests",
    description:
      "Write Playwright tests covering login, creating a task, editing it, and deleting it.",
    createdAt: "2026-10-29T09:15:00-03:00",
  },
  {
    id: 32,
    title: "Implement audit logging",
    description:
      "Record who changed what and when for sensitive actions, and expose the log to admins.",
    createdAt: "2026-10-29T13:50:00-03:00",
  },
  {
    id: 33,
    title: "Review security headers",
    description:
      "Configure CSP, HSTS, and other security headers and run a dependency vulnerability scan.",
    createdAt: "2026-10-30T10:05:00-03:00",
  },
  {
    id: 34,
    title: "Write deployment runbook",
    description:
      "Document the steps for deploying, rolling back, and troubleshooting production incidents.",
    createdAt: "2026-10-30T16:20:00-03:00",
  },
  {
    id: 35,
    title: "Prepare release notes",
    description:
      "Summarize new features, fixes, and known issues for the upcoming v1.0 release.",
    createdAt: "2026-10-31T11:40:00-03:00",
  },
];
