#AgentForge History

## v1.9 - Reviewer to fixer workflow

Added a workflow that uses review feedback to update saved Java projects.

### Changes

- Added a Fixer Agent that receives project requirements, current source files, test files, and review notes.
- Added an API endpoint for applying review fixes.
- Run the Reviewer Agent again after the Fixer Agent responds.
- Save the original project and subsequent changes as numbered revisions.
- Store source files, test files, review notes, and change summaries for each revision.
- Added an API endpoint for retrieving project revision.
- Added an Apply Review Fixes button with loading and error states.
- Display the latest fix summary and revision history.
- Reset project-sepcific frontend state when switching projects.
- Prevent a completed fix request from changing the user's selection.

### Verifciation

- Confirmed revisions persist after refreshing pages.
- Compared revisions 2 and 3 of the Instagram example.
- Confirmed AuthService.java gained blank-input validation.
- Confirmed the other source files and all test files were unchanged.
- Run the generated Java tests: 23 passed and 1 failed.

### Current Limitations

The Fixer Agent reveives review notes but does not receive Maven test failure output. Applying fixes doesn't automatically run tests or guarantee that the updated project passes them.

AI-generated change summaries and review notes can be inaccurate. Saved file comparisons and actual test execution provide stronger evidence of what changed and whether it works.

## v1.8 - Secure Docker Execution

Improved the secruity of Docker based java test execution.

### Changes

- Added a dedicated AgentForge Java runner image.
- Preloaded Maven and JUnit dependencies for offline execution.
- Disabled network access during test execution.
- Added CPU, memory, process, and timeout limits.
- Removed Linux capabilities and prevented privilege escalation.
- Executed generated code as a non root user.
- Added read-only container storage with controlled temporary filesystems.
- Fixed maven offline dependency and Jansi configuration issues.

Generated code now runs in a more isolated and resource limited environment. This reduces security risks and prepares AgentForge for more advanced automated development workflows.

---

## v1.7 - Generated Project ZIP Export

Added support for downloading generated AgentForge projects as complete Maven ZIP files.

### Changes

- Added a project download endpoint:
  - `GET /api/projects/:id/download`
- Added an export service using Archiver.
- Added a shared Maven `pom.xml` generator.
- Added a Download ZIP button to the frontend.
- Added safe ZIP file name generation based on the project idea.
- Added a generated README file to each exported project.
- Added Java source files under:
  - `src/main/java`
- Added JUnit test files under: -`src/test/java`

### Then the project structure will be

```text
generated-project/
  pom.xml
  README.md
  src/
    main/
      java/
        GeneratedSourceFiles.java
    test/
      java/
        GeneratedTestFiles.java
```

## v1.6 - Delete saved projects

Added project deletion for saved generated projects.

### Changes

- Added `DELETE /api/projects/:id`.
- Added backend deletion logic.
- Added a Delete button to project history items.
- Added confirmation before deleting a project.
- Deleted projects are removed from the frontend straight away.
- If the selected project is deleted, the output panel is cleared.

Users can now manage their saved project history. Related test runs are removed automatically through the database relationship.

---

## v1.5 - Saved Test Run Results

Added database persistence for Docker test runs.

### Changes

- Added a `TestRun` Prisma model.
- Linked test runs to generated projects.
- Saved Docker test execution results to PostgreSQL.
- Added an edpoint to fetch previous test runs for a project.
- Updated the frontend to show previous test runs.

AgentForge now keeps a history of test executions. This makes generated projects easier to inspect and turns test execution into a persistent part of the workflow.

---

## v1.4 - Docker Java Test Runner

Added Docker based Java test execution.

### Changes

- The backend now creates a temporary Maven project for each test run.
- Generated source files are written into `src/main/java`.
- Generated test files are written into `src/test/java`.
- AgentForge runs `mvn test` inside a Docker Maven container.
- Test output is returned to the frontend.
- The frontend can now show whether generated tests passed or failed.

AgentForge can now verify generated Java code instead of only displaying it. This turns the project from an AI code generator into a working AI software engineering workflow.

---

## v1.3 - Test Execution API prepared

Added the first version of the test execution flow.

### Changes

- Added a backend test runner service.
- Added `POST /api/projects/:id/run-tests`.
- Added a frontend `Run Tests` button.
- Added UI for showing test execution output.

This prepares AgentForge for Docker based Java test Execution. The app now has the API and UI structure needed before safely running generated code in a sandbox.

---

## v1.2 - Structured Java File Generation

Changed AgentForge from generating one large code string and one large test string to generating structured Java files.

### Changes

- Replaced `code` and `tests` with `sourceFiles` and `testFiles`.
- Added a `GeneratedFiles` types with `fileName` and `content`.
- Updated the Code Agent to return Java source files as JSON.
- Updated the Test Agent to return JUnit test files as JSON.
- Updated the Reviewer Agent to review structured files.
- Updated Prisma and the frontend to store and display multiple generated files.

Structured files prepare AgentForge for Docker based java test execution. The backend can now writ generated files to disk later and run them inside a sandboxed Java enviroment.

---

## v1.1 - Frontend refactor

Refactored the React frontend into smaller reusable files.

### Changes

- Moved project types into `types.ts`.
- Moved API calls into `api/projectsApi.ts`.
- Created reusable components for:
  - project form
  - project history
  - project output
  - output lists
  - code blocks
- Kept the same user-facing behaviour while improving the frontend structure.

## The frontend is now easier to maintain and grow. In the future features like deleting the projects, viewing project details, exporting files, and running generated code can be added without making `App.tsx` too large.

---

## v1.0 - AI Output Reliability

Improved the reliability of AI output parsing and workflow debugging.

### Changes

- Added a shared `parseJsonArrayResponse` utility.
- The utility cleans AI JSON responses, parses them, checks that the result is an array, and confirms every item is a string.
- Updated Requirements Agent, Design Agent, and Reviewer Agent to use the shared parser
- Added backend workflow logs so it is easier to see which agent is running or failing.
- Improved the controller error message for AI workflow failures.

## AI responses sometimes including markdown formatting or unexpected output. This version makes AgentForge more stable and easier to debug before adding more advanced features like code execution.

---

## v0.9 - FrontEnd Project History

Added a project history section to the frontend.

Users can now generate a project, save it to PostgreSQL through the backend, view previous generated projects, and click a saved project to display its requirements, class design, generated code, tests, and review notes.

## This makes AgentForge feel more like a real application instead of a one time generator and disappear.

---

## v0.8 - PostgreSQL and Prisma Setup

Set up PostgreSQL using Docker and connected it to the backend with Prisma

### Changes

- Added Docker Compose PostgreSQL service.
- Installed Prisma ORM and Prisma Client
- Created the first database model: `Project`
- Added a Prisma migration for project history storage.
- Moved the local database port to `5433` to avoid a conflict on `5432`

---

## v0.7 - Backend Cleanup

Renamed `fakeAgentService.ts` to `projectAssembler.ts` because the generated output is not fake anymore.

Added a shared `cleanJsonResponse` utility to remove markdown code fences from AI JSON responses before parsing them.

## This makes the backend cleaner and reduces repeated parsing logic across the AI agents.

---

## v0.6 - AI Reviewer Agent

AgentForge now includes a Reviewer Agent.

The Reviewer Agent receives the project idea, requirements, class design, generated Java code, and generated JUnit tests. It returns review notes about possible bugs, missing validation, design improvements, and missing test cases.

The app now has the full AI workflow

```text
User Idea
-> Requirements Agent
-> Design Agent
-> Code Agent
-> Test Agent
-> Reviewer Agent
```

---

## v0.5 - AI Test Agent

In this version, AgentForge added a Test Agent.

The Test Agent receives the project idea, requirements, class design, and generated Java code. It then creates JUnit 5 tests based on the generated code.

### How The Flow Works Now

```text
User idea
-> Requirements Agent
-> Design Agent
-> Coding Agent
-> Test Agent
-> fake review output
```

---

## v0.4 - AI Coding Agent

The third AI agent is added: Java Coding Agent.

It takes requirements, and classes then generates the Java Code.

### How The Flow Works Now

```text
User idea
-> Requirements Agent
-> Design Agent
-> Coding Agent
-> fake tests/review
```

---

## v0.3 - AI Design Agent

In this version, AgentForge added a second AI agent: the Design Agent.

The Requirements Agent creates software requirements from the user's project idea. Then the Design Agent uses the project idea and those requirements to suggest Java class names for the system.

### How The Flow Works Now

```text
User idea
-> Requirements Agent
-> Design Agent
-> fake code/tests/review output
```

---

## v0.2 - OpenAI Requirements Agent

Here i upgraded from the fully fake output to its first real AI powered step.

### What changed

- Added OpenAI API integration to the Express backend.
- Added a new Requirements Agent service.
- The backend now sends the user's project idea to OpenAI.
- OpenAI returns a list of software requirements based on the idea.
- The rest of the response still uses fake placeholder data for now:
  - classes
  - Java code
  - JUnit tests
  - review notes

### How The Flow Works Now

```text
User enters a project idea
-> React sends the idea to the Express backend
-> projectController receives the request
-> requirementsAgent sends the idea to OpenAI
-> OpenAI returns generated requirements
-> fakeAgentService combines real requirements with fake class/code/test/review output
-> Backend returns the full response to the frontend
```
