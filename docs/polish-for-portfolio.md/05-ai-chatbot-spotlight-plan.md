---
Title: AI Chatbot Spotlight Plan
Author: Chien Escalera Duong
Date Created: 2025-10-03
Time Created: 17:13:42 PDT
Last Updated: 2025-10-03 17:13:42 PDT
Version: 1.0
---

# Objective
- **Goal** Elevate the Gemini-powered dining assistant as a flagship feature through UX refinements, storytelling assets, and testing.
- **Success Criteria** Chatbot showcased prominently in UI and README, responsive on mobile, validated by automated tests, and demo assets available for portfolio use.

# Scope
- **In-Scope** Chat assistant UI/UX, Gemini prompt handling, fallback flows, README documentation, demo media, automated validation.
- **Out-of-Scope** Building new AI capabilities beyond menu recommendations, backend persistence of chat history.

# Dependencies
- **TypeScript** Migration plan to provide types for chat components (dependency on TS plan).
- **Playwright** Route mocking for Gemini tests (dependency on Playwright plan).
- **Assets** Access to screen recording tools, design tokens for styling updates.

# Deliverables
- **UX** Mobile-optimized chat window, improved accessibility, consistent theming.
- **Testing** Playwright spec validating chatbot responses and item card rendering.
- **Docs** README section with feature narrative, how-to-use, and architecture notes.
- **Media** GIF or Loom demo showcasing chat assistant in action.

# Work Breakdown Structure
- **Phase 0: Audit & Requirements** Evaluate current chat UX, gather feedback, confirm Gemini API usage.
- **Phase 1: UI/Accessibility Improvements** Adjust layout, focus management, ARIA labels, animations.
- **Phase 2: TypeScript & Logic Hardening** Apply TS types, ensure robust error handling, caching.
- **Phase 3: Automated Validation** Implement Playwright test with mocked AI responses.
- **Phase 4: Storytelling Assets** Capture demo media, annotate prompt/response flow, add README copy.

# Task Tracker
| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| AI-01 | Conduct UX audit of `ChatFeatureContainer` and supporting components. | TBD | Not Started | Document pain points. |
| AI-02 | Update chat styles in `ChatAssistant.module.css` for mobile responsiveness. | TBD | Not Started | Ensure 44px tap targets. |
| AI-03 | Improve accessibility (focus traps, ARIA live regions). | TBD | Not Started | Validate with screen readers. |
| AI-04 | Convert chat components/services to TypeScript. | TBD | Not Started | Coordinate with TS plan tasks TS-09. |
| AI-05 | Implement Playwright spec with Gemini mock. | TBD | Not Started | Reuse `chat-assistant.spec.ts`. |
| AI-06 | Add README section detailing chatbot capabilities and tech stack. | TBD | Not Started | Include architecture diagram if possible. |
| AI-07 | Capture screen recording/GIF of chatbot assisting user. | TBD | Not Started | Store assets in `docs/media/`. |
| AI-08 | Update `recommended-actions-index.md` status upon completion. | TBD | Not Started | Mark milestone progression. |

# Implementation Steps
- **Phase 0** Review current code, identify responsiveness/accessibility gaps, confirm localStorage persistence requirements.
- **Phase 1** Apply CSS tweaks for mobile, ensure animations are performant, add clear buttons and statuses.
- **Phase 2** Use shared `ChatMessage` types, handle API errors gracefully, provide fallback recommendations offline.
- **Phase 3** Extend Playwright tests to intercept Gemini API, assert message content and item card display.
- **Phase 4** Draft README narrative with bullet points, embed media, highlight technical differentiators.

# Validation Plan
- **Manual** Test chat on mobile emulator (iOS/Android breakpoints), confirm keyboard handling and persistence.
- **Automated** Playwright spec passes consistently, Vitest coverage for helper utilities.
- **Accessibility** Run axe on chat open state; manual keyboard navigation check.

# Risk & Mitigation
- **Risk** Gemini API rate limits during demos. **Mitigation** Provide offline mock or stub script.
- **Risk** Mobile viewport overflow. **Mitigation** Use CSS clamp and safe-area insets.
- **Risk** Demo recordings become outdated. **Mitigation** Version assets and update README timestamps.

# Rollback Strategy
- **Code** Feature branch for chat polish; revert styling changes if regressions discovered.
- **Docs** Maintain previous README section for quick rollback.

# Communication Cadence
- **Updates** Share UX before/after screenshots, demo link with stakeholders.
- **Reviews** Request design/accessibility review for UI changes, code review for TS/Playwright updates.

# Exit Criteria
- **Technical** Chat components typed, tests passing, responsive design validated.
- **Operational** README and demo assets highlight chatbot prominently; index updated to reflect status.
