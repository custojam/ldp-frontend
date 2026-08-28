Generate a technical plan for the current spec.

Tech stack override (if provided): $ARGUMENTS

## Steps

1. Read `.speckit/memory/constitution.md`.
2. Identify the target spec:
   - If $ARGUMENTS contains a spec path, use it.
   - Otherwise use the most recently modified spec with Status: Ready.
3. Confirm the spec status is `Ready` (not `Draft`). If still Draft, stop and ask the user to
   run `/speckit.clarify` first.
4. Write `.speckit/specs/YYYY_MM_DD_HHMMSS_feature-name/plan.md` using the template below.
5. Update the spec's **Status** to `Planned`.

## plan.md Template

```markdown
# Plan YYYY_MM_DD_HHMMSS — [Feature Name]

**Spec:** [link to spec.md]
**Status:** Draft | Ready | In Progress | Done
**Created:** YYYY-MM-DD

## Technical Approach
Describe the approach and why it was chosen over alternatives.

## Tech Stack
List the specific technologies, versions, and libraries used.

## Architecture Diagram (optional)
ASCII diagram of how components interact.

## File Changes
List every file that will be created, modified, or deleted —
**including test files**. A row for the source file without a row for
its test file is incomplete.

| Action | File | Reason |
|--------|------|--------|
| CREATE | src/app/(admin)/leads/page.tsx | New admin page |
| CREATE | src/components/admin/LeadStatusBadge.tsx | New component |
| CREATE | specs/lead.spec.ts | Jest coverage for leads page |

## API Calls
List the backend endpoints this feature calls, and which `src/lib/api.ts`
functions are added or modified.

## Page / Component Changes
Describe new or modified Next.js pages and React components.
Note which pages are protected (admin layout) and which are public.

## Error Handling
How loading, empty, error, and success states are handled in the UI.

## Security Considerations
Which routes are protected by Next.js middleware. Confirm public pages
do not send auth tokens.

## Testing Plan

### Jest (`specs/`) — REQUIRED for any change in `src/`
List every spec file that will be created or modified, with a one-line
description of what each new test covers (constitution §VIII).

| Test file | Action | What it covers |
|---|---|---|
| `specs/lead.spec.ts` | CREATE | status badge CSS classes, assign button visibility, filter behaviour |

## Risks & Mitigations
Known unknowns and how to handle them.
```

**Test rule (NON-NEGOTIABLE):** A plan that adds or modifies a page,
component, or lib file without a corresponding row in the File Changes
table AND a Testing Plan entry is incomplete. Stop and add them before continuing.

After writing the plan, print a summary of file changes and prompt the user to run `/speckit.tasks`.
