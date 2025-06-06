---
Title: Little Lemon Mobile App Problem Finding Template
Author: Chien Escalera Duong
Date Created: 2025-06-05
Time Created: 20:44:12 PDT
Last Updated: 2025-06-06 12:50:00 PDT
Version: 1.0
---

# Mobile-Adapted Problem Finding Template

### Evaluator Information
- **Evaluator Name:** Cascade (AI Assistant) & Chien Escalera Duong
- **Device / OS:** Mobile (Simulated via Code Analysis)
- **App Version:** N/A (Code Analysis of Reservation Feature)
- **Date:** 2025-06-06

---

### Ease to Fix Rating (ER) Legend
- **E0:** Fix will require maximum effort
- **E1:** Fix will require considerable effort
- **E2:** Fix will require some effort
- **E3:** Fix is easy but with minor effort
- **E4:** Fix is trivial and easy to implement

---

## 1. Visibility of System Status
> The mobile app informs the user about what is going on through constructive, appropriate and timely feedback.

| Problem Found | Screen/Location | ER | Recommendation |
| :------------ | :-------------- | :- | :------------ |
|               |                 |    |               |
|               |                 |    |               |
|               |                 |    |               |

---

## 2. Match Between System and the Real World
> Language usage, such as terms and phrases, symbols and concepts, is similar to that used in their day-to-day environment by the users. Information is arranged in a natural and logical order.

| Problem Found | Screen/Location | ER | Recommendation |
| :------------ | :-------------- | :- | :------------ |
|               |                 |    |               |
|               |                 |    |               |
|               |                 |    |               |

---

## 3. User Control and Freedom
> Users often choose system functions by mistake and will need a clearly marked "emergency exit" to leave the unwanted state without having to go through an extended dialogue. Support undo and redo.

| Problem Found                                                                 | Screen/Location                                       | ER | Recommendation                                                                                                |
| :---------------------------------------------------------------------------- | :---------------------------------------------------- | :- | :------------------------------------------------------------------------------------------------------------ |
| Users cannot modify or cancel submitted reservations online via the app.        | Post-submission (e.g., from confirmation or user profile) | E1 | Implement features to allow users to view, modify (e.g., time, party size), and cancel their bookings online. |
|               |                 |    |               |
|               |                 |    |               |

---

## 4. Consistency and Adherence to Standards
> Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.

| Problem Found                                                                 | Screen/Location                                       | ER | Recommendation                                                                                                |
| :---------------------------------------------------------------------------- | :---------------------------------------------------- | :- | :------------------------------------------------------------------------------------------------------------ |
| App uses custom branding over strictly adhering to native OS visual guidelines. | Entire reservation flow                               | E3 | Continue with custom branding for consistency, but periodically review against platform updates to ensure no major UX conflicts arise. (Low priority if branding is intentional and consistent). |
|               |                 |    |               |
|               |                 |    |               |

---

## 5. Error Prevention
> The system is designed so that the users cannot easily make serious usability errors. When a user makes an error, the application gives an appropriate error message.

| Problem Found | Screen/Location | ER | Recommendation |
| :------------ | :-------------- | :- | :------------ |
|               |                 |    |               |
|               |                 |    |               |
|               |                 |    |               |

---

## 6. Recognition Rather Than Recall
> Minimize the user's memory load by making objects, actions, and options visible. The user should not have to remember information from one part of the dialogue to another. Instructions for use of the system should be visible or easily retrievable whenever appropriate.

| Problem Found                                                                 | Screen/Location                                       | ER | Recommendation                                                                                                |
| :---------------------------------------------------------------------------- | :---------------------------------------------------- | :- | :------------------------------------------------------------------------------------------------------------ |
| System does not remember details from past, separate reservations for quick rebooking. | Start of reservation flow / User account area (if exists) | E2 | Implement a feature to show past reservation details and offer a "rebook" or "use previous details" option. |
|               |                 |    |               |
|               |                 |    |               |

---

## 7. Flexibility and Efficiency of Use
> Accelerators -- unseen by the novice user -- may often speed up the interaction for the expert user such that the system can cater to both inexperienced and experienced users. Allow users to tailor frequent actions.

| Problem Found                                                                 | Screen/Location                                       | ER | Recommendation                                                                                                |
| :---------------------------------------------------------------------------- | :---------------------------------------------------- | :- | :------------------------------------------------------------------------------------------------------------ |
| No shortcuts for frequent users (e.g., quick booking from history).           | Start of reservation flow / User account area (if exists) | E2 | Similar to Heuristic 6, provide options for quick booking based on past reservations or saved preferences.      |
| No interface customization or saved preferences (e.g., default party size).   | User settings / Start of reservation flow             | E2 | Allow users to save default preferences like party size or typical booking time to pre-fill form fields.      |
|               |                 |    |               |

---

## 8. Aesthetic and Minimalism in Design
> Dialogues should not contain information which is irrelevant or rarely needed. Every extra unit of information in a dialogue competes with the relevant units of information and diminishes their relative visibility.

| Problem Found | Screen/Location | ER | Recommendation |
| :------------ | :-------------- | :- | :------------ |
|               |                 |    |               |
|               |                 |    |               |
|               |                 |    |               |

---

## 9. Recognition, Diagnosis, and Recovery from Errors
> Error messages are expressed in plain language. Error messages indicate precisely what the problem is and give quick, simple, constructive, specific instructions for recovery.

| Problem Found | Screen/Location | ER | Recommendation |
| :------------ | :-------------- | :- | :------------ |
|               |                 |    |               |
|               |                 |    |               |
|               |                 |    |               |

---

## 10. Help and Documentation
> Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation. Any such information should be easy to search, focused on the user's task, list concrete steps to be carried out, and not be too large.

| Problem Found                                                                 | Screen/Location                                       | ER | Recommendation                                                                                                |
| :---------------------------------------------------------------------------- | :---------------------------------------------------- | :- | :------------------------------------------------------------------------------------------------------------ |
| No direct link to broader help/FAQ from within the reservation flow.          | Throughout reservation flow (e.g., in a header/footer)  | E3 | Add a small, unobtrusive link or icon (e.g., '?') that leads to a general help/FAQ page.                     |
| No integrated FAQ or knowledge base directly accessible within the flow.      | Throughout reservation flow / Help section            | E2 | Consider integrating a small, searchable FAQ or knowledge base accessible via the help link.                |
|               |                 |    |               |

---

## Mobile-Specific Issues

### Touch Interaction

| Problem Found | Screen/Location | ER | Recommendation |
| :------------ | :-------------- | :- | :------------ |
|               |                 |    |               |
|               |                 |    |               |
|               |                 |    |               |

---

### Performance and Responsiveness

| Problem Found                                                                 | Screen/Location                                       | ER | Recommendation                                                                                                |
| :---------------------------------------------------------------------------- | :---------------------------------------------------- | :- | :------------------------------------------------------------------------------------------------------------ |
| Basic error handling for poor network conditions, but not extensive offline support. | Network-dependent operations (fetching times, submitting) | E1 | Enhance network error handling with more informative messages, retry options, or potential caching of static data. Consider if minimal offline browsing of info is feasible. |
|               |                 |    |               |
|               |                 |    |               |

---

### Form Input and Keyboard Interaction

| Problem Found | Screen/Location | ER | Recommendation |
| :------------ | :-------------- | :- | :------------ |
|               |                 |    |               |
|               |                 |    |               |
|               |                 |    |               |

---

## Summary of Findings

### Most Critical Issues (Priority 1)
*High Impact (SR 3-4) AND Low-Medium Effort (ER E2-E4)*

1. *None identified based on current SR/ER ratings and prioritization criteria.*
2. 
3. 

### High Severity Issues (Priority 2)
*High Impact (SR 3-4) AND High Effort (ER E0-E1)*

1. **Inability to Modify/Cancel Reservations Post-Submission (SR 3, ER E1):** Users cannot alter or cancel their bookings through the app after confirming, requiring manual intervention (e.g., phone call). (Heuristic 3)
2. 
3. 

### Quick Wins (Priority 3)
*Low-Medium Impact (SR 1-2) AND Low Effort (ER E3-E4)*

1. **Platform Design Guideline Adherence (SR 1, ER E3):** The app uses custom branding, which, while consistent, doesn't strictly follow native OS visual guidelines. (Heuristic 4)
2. **Help Documentation Accessibility (SR 1, ER E3):** No direct link to a broader help/FAQ section is available from within the reservation flow. (Heuristic 10)
3. 

### Long-term Improvements (Priority 4)
*Low-Medium Impact (SR 1-2) AND Medium-High Effort (ER E0-E2)*

1. **Lack of Past Reservation Recall for Rebooking (SR 2, ER E2):** The system doesn't remember details from previous bookings to expedite rebooking. (Heuristic 6)
2. **No Shortcuts for Frequent Users (SR 2, ER E2):** The app lacks accelerators like quick booking from history for experienced users. (Heuristic 7)
3. **No Interface Customization or Saved Preferences (SR 1, ER E2):** Users cannot save default preferences (e.g., party size, typical time) to pre-fill forms. (Heuristic 7)
4. **No Integrated FAQ/Knowledge Base (SR 1, ER E2):** A dedicated FAQ or knowledge base is not directly accessible within the reservation flow. (Heuristic 10)
5. **Limited Offline Support/Network Resilience (SR 1, ER E1):** While basic error handling for network issues exists, there's no extensive offline support or advanced network resilience. (Mobile-Specific)
