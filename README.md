# Sovereign Justice Portal - Algeria MVP

This repository contains the MVP for rebuilding "Litige.fr" specifically for the Algerian legal market, fully compliant with the **Algerian Code of Civil and Administrative Procedure (CPCA - Law 08-09 and 22-13)**.

## Key Features

1. **Algerian Legal Compliance**:
   - Workflows tailored for "Mise en Demeure" (إعذار), "Injonction de Payer" (أمر بالأداء), and "Labor Disputes" (نزاعات العمل).
   - Hardcoded Algerian logic for legal deadlines (e.g., 15-day formal notice period, 14-day labor dispute conciliation).
   
2. **Multi-Language Architecture (i18n)**:
   - Dynamic real-time toggling between Arabic (RTL), French (LTR), and English (LTR).
   - Arabic acts as the **"Legal Truth"** for document generation, while French and English serve as instructional overlays.

3. **Document Engine**:
   - Uses `puppeteer` to generate PDFs via the `/api/generate-pdf` endpoint.
   - Built with specialized capabilities for rendering complex Arabic ligatures and right-to-left textual direction.
   - Outputs documents styled with official Algerian court margins and headings (e.g., "الجمهورية الجزائرية الديمقراطية الشعبية").

## Technical Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Backend / Auth**: Node.js APIs within Next.js (prep for Supabase integration).
- **Document Engine**: Puppeteer.

## Repository Structure

- `src/app/page.tsx`: The main intake dashboard with i18n logic (UI).
- `src/lib/i18n/legal-terms.json`: Centralized translation map mapping Algerian terms to French and English counterparts.
- `src/lib/algerian-logic/deadlines.ts`: Module establishing timeframes per the CPCA.
- `src/app/api/generate-pdf/route.ts`: Document generation template endpoint utilizing Puppeteer.

## Deployment for the Algerian Market

When deploying this application for the Algerian market, follow these strict guidelines:

### 1. Font and Typography Installation
Arabic legal documents require specific typography.
- Make sure `Cairo` or `Traditional Arabic` fonts are properly imported in production templates.
- If using Docker or a Linux server (e.g., Ubuntu on AWS or Algerian local hosters), you must install Arabic font dependencies to prevent Puppeteer from rendering rectangles instead of Arabic ligatures.
  ```bash
  sudo apt-get install fonts-hosny-amiri
  ```

### 2. Puppeteer Dependencies
Because this application uses Puppeteer to render Arabic text to PDF correctly, ensure your hosting environment has the necessary shared libraries. For Ubuntu:
```bash
sudo apt-get install -y libgbm-dev libnss3 libxss1 libasound2 libatk-bridge2.0-0 libgtk-3-0
```

### 3. Server Location & Data Sovereignty
To adhere strictly to data privacy standards in legal tech, it is strongly recommended that database hosts and storage endpoints be located within or as close as practically allowed to Algeria (or compliant European datacenters under specific agreements), especially concerning personally identifiable information (PII) such as ID cards and case files.

### 4. Database Setup (Supabase)
To add a persistent backend:
1. Initialize a new Supabase project.
2. In the Supabase dashboard, execute SQL schema setting up `cases`, `plaintiffs`, and `defendants`.
3. Configure Row-Level Security (RLS) policies ensuring users can only securely view their active dockets.

### 5. Start the Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` to view the UI.
4. Interact with the `/api/generate-pdf` endpoint by passing proper JSON payloads to retrieve legally compliant PDF notices.
