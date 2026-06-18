# Risk Adjustment Coding-Accuracy Tool

A small companion tool I added to the facility project. You give it two sets of ICD-10 codes for a patient — what was **submitted** and what's **validated** (the gold set) — and it measures how accurate the coding was: precision, recall, F1, and the actual lists of false positives and false negatives, at both the ICD-10 code level and the HCC category level.

It's one static page (`public/risk-adjustment.html`) plus two data files. No backend, no network calls, no PHI. Everything runs in the browser.

## What it does

1. Takes a submitted set and a gold set of ICD-10 codes (type them in, or load a synthetic sample patient).
2. Maps each code to its HCC category using a CMS-HCC V28 crosswalk file.
3. Computes precision, recall, F1, and the counts and lists of false positives and false negatives.
4. Shows a confusion-style summary (TP / FP / FN).
5. Lets you switch between the ICD-10 code level and the HCC category level and see how the numbers change.

## The data is synthetic — important

- The patient claims are **100% made up**. No real patients, no PHI, fictional everything. Every screen says so.
- The ICD-10 → HCC crosswalk shipped here is a **small demo sample**, not the full official mapping, and the HCC category numbers in it are **illustrative**. For any real use, replace `public/data/hcc-crosswalk-sample.json` with the official CMS PY2026 V28 ICD-10-to-HCC crosswalk from CMS:
  https://www.cms.gov/medicare/payment/medicare-advantage-rates-statistics/risk-adjustment/2026-model-software-icd-10-mappings
- The tool reads whatever mappings are in that file, so swapping in the official file doesn't require any code changes.

## What it does NOT claim

- It does not calculate RAF scores or payment amounts.
- It does not implement the full HCC hierarchy / "constraining" logic (where only the most severe HCC in a family counts). That's a known next step, not done here.
- It is not validated against real claims and is not a compliance tool. It's a demo of the accuracy math.

## The concepts (so the numbers mean something)

- **HCC / Risk Adjustment:** Medicare pays Medicare Advantage plans more for sicker members. Diagnoses (ICD-10) can map to HCC categories that carry payment weight.
- **True Positive:** a code in both the submitted and gold sets — captured correctly.
- **False Positive:** submitted but not supported by the gold set. In RA terms, an unsupported code = audit/compliance risk and possible overpayment.
- **False Negative:** in the gold set but not submitted. A missed valid condition = lost revenue and an incomplete risk picture.
- **Precision = TP / (TP + FP):** of what you submitted, how much was right. Low precision = over-coding.
- **Recall = TP / (TP + FN):** of what you should have caught, how much you got. Low recall = under-coding.
- **F1 = 2·P·R / (P + R):** harmonic mean of the two; only high when both are high.
- **Code level vs HCC level:** two different ICD-10 codes can map to the same HCC. A wrong-but-same-HCC code is a miss at the code level but a match at the HCC level — and the HCC level is what drives payment. The tool shows both because they answer different questions (documentation precision vs payment capture).

## Running it

It fetches the two JSON data files, so it needs to be served, not opened as a file.

```bash
vercel dev
# or
python3 -m http.server 8000   # then open http://localhost:8000/risk-adjustment.html
```

On the deployed Vercel site it's linked from the main page, or at `/risk-adjustment.html`.

## Files

```
public/risk-adjustment.html          the tool
public/data/hcc-crosswalk-sample.json  demo ICD-10 -> HCC sample (replace with official CMS file)
public/data/synthetic-claims.json      synthetic sample patients
```

## Data sources

- HCC model: CMS-HCC V28, payment year 2026 (the model in full effect as of Jan 1, 2026).
- Crosswalk: official source is the CMS Risk Adjustment model software / ICD-10 mappings page (link above). The sample file here is for demo only.
