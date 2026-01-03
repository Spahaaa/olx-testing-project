# SE302 Course Project — Automated Web Testing with Playwright (OLX.ba)

## Overview

This project demonstrates automated web testing using Playwright and the Page Object Model (POM). Tests target the OLX.ba website and include functional and smoke test suites.

## Test cases (15 total)

Functional (10)
1. Login - empty email and password (negative)
2. Login - empty email (negative)
3. Login - empty password (negative)
4. Login - invalid email format (negative)
5. Login - wrong password (negative)
6. Register - empty fields (negative)
7. Register - invalid email (negative)
8. Search - results displayed
9. Create Ad - open create-ad flow
10. Header - navigation links present

Smoke (5)
1. Auth - open login
2. Auth - open register
3. Search - basic search
4. Create Ad - open create ad
5. Header - basic header presence

## Evidence

- Place screenshots and Playwright HTML report in `reports/` after execution. Include traces and logs when available.

## Challenges and solutions

- Document encountered blocking elements (cookie banners) and handling in page objects (`acceptCookiesIfPresent`).

## Test case tables

- Use the table below as a template to document each test case when executing and capturing evidence.

| ID | Name | Steps | Expected | Result | Evidence |
|----|------|-------|----------|--------|----------|
| 1  | ...  | ...   | ...      | ...    | screenshot.png |
