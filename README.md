# Facility Assessment Snapshot

A tool I built for the Medelite case study. You type in a facility's CCN, it pulls that facility's public CMS data, you add a few internal fields by hand, and you can download the result as a PDF or a Word doc.

The front end is one `public/index.html`. There's a small backend function (`api/cms.js`) that fetches the CMS data so the browser doesn't run into CORS issues.

## Links

- Live app: https://med-project-ky48t1fwu-moksh-jain-s-projects1.vercel.app
- Repo: https://github.com/MokshJainrock/Med-project

## How to use it

Type a CCN, hit Fetch, and it shows the report. Fill in the manual fields, then download it as a PDF or Word doc.

Use `686123` (Kendall Lakes Healthcare and Rehab Center in Miami) to see the sample facility.

Note: the lookup only works on the live site, not if you open the file on your own computer, because it needs the backend function.

## What it does

The main features:

- Looks up any valid 6-digit CCN. Short numeric ones get padded with zeros.
- Pulls the name, address, certified beds, and the four star ratings from CMS.
- You can override the facility name. That only changes the report, not the INFINITE banner.
- Manual fields: EMR, Current Census, Patient Type, Previous Coverage (Yes/No), Previous Provider Performance, Medical Coverage.
- PDF download with the banner and a link back to that facility's CMS page.
- The CMS link is built from the CCN.
- The INFINITE banner is fixed, so it never gets replaced by the facility name.

Extra stuff I added:

- All 12 hospitalization and ED metrics. STR is short-stay, LT is long-stay. Each shows the facility's number next to the national and state averages.
- Word download as well as PDF.
- Cards for the 12 metrics.
- Handles bad CCNs, no results, and errors instead of just breaking.

## Where each field comes from

| Field | Source | Notes |
|---|---|---|
| Name of Facility | CMS + override | provider name, or your override text |
| Location | CMS | full address |
| EMR | manual | |
| Census Capacity | CMS | certified beds |
| Current Census | manual | |
| Type of Patient | manual | |
| Previous Coverage from Medelite | manual | Yes/No |
| Previous Provider Performance | manual | |
| Medical Coverage | manual | |
| Overall / Health / Staffing / Quality | CMS | the four star ratings |
| 12 Hospitalization & ED metrics | CMS claims | facility scores from the claims data, averages from the state/national data |

STR uses the short-stay measures and LT uses the long-stay ones. The long CMS names get shortened in code to match the labels in the Medelite layout.

## How it's set up

- `public/index.html` is the app.
- `api/cms.js` is a small function that fetches CMS on the server, so the browser call stays on the same domain and there's no CORS problem.
- Deployed on Vercel. It serves the `public` folder and turns `api/cms.js` into a function automatically. No build step.

## Running it locally

```bash
npm i -g vercel
vercel dev
```

Then open the localhost link it prints. The lookup needs the function, so use `vercel dev` rather than opening the file directly.

## A few notes

- The main data comes from the CMS Provider Information dataset (4pq5-n9py), looked up by CCN.
- The claims and averages dataset IDs are found at runtime, so they keep working if CMS changes them. Known IDs are kept as a backup.
- PDF uses jsPDF, Word uses docx. The stars in the PDF are drawn as shapes because the default PDF font has no star character.

## Test CCN

Use `686123` for Kendall Lakes in Miami, FL. Any other valid CCN works too.

## Files

```
api/cms.js              backend function that fetches CMS
public/index.html       the app
public/samples/         example PDF and Word doc
vercel.json             vercel config
```

## Data

The data comes from the CMS Provider Data Catalog (data.cms.gov), which is public domain. The report is for internal use and isn't an endorsement by HHS or CMS.
