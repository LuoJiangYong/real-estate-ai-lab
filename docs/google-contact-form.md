# Google Contact Form Setup

This site can submit the contact form to a Google Apps Script Web App. The script writes each submission to Google Sheets and sends an email notification to:

```text
richard.luo.bp@gmail.com
```

## 1. Create the Google Sheet

1. Open Google Sheets with the target Google account.
2. Create a new spreadsheet named `COSKY.AI Project Contacts`.
3. Open `Extensions > Apps Script`.

## 2. Add the Apps Script

Copy the contents of:

```text
integrations/google-apps-script/contact-form.gs
```

into the Apps Script editor.

## 3. Deploy as a Web App

1. Click `Deploy > New deployment`.
2. Select type: `Web app`.
3. Description: `COSKY.AI contact form`.
4. Execute as: `Me`.
5. Who has access: `Anyone`.
6. Deploy and authorize the script.
7. Copy the Web App URL ending in `/exec`.

## 4. Connect the Website

Paste the Web App URL into:

```yaml
reservation:
  endpoint: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
```

in `data/site.yaml`, then commit and push.

## Current Behavior

- When `reservation.endpoint` is set, the website submits online to Google Apps Script.
- Google Apps Script writes to the linked Google Sheet with this column order:
  - Column 1: 序号
  - Column 2: 日期时间
  - Column 3: 姓名
  - Column 4: 邮箱
  - Column 5: 填写的信息
  - Column 6: 人工跟进字段
  - Column 7: 人工跟进字段
- Google Apps Script sends a notification email to `richard.luo.bp@gmail.com`.
- When `reservation.endpoint` is empty, the website falls back to opening a mail draft.

## Notes

The browser uses a no-CORS request for the Apps Script submission. This avoids cross-origin preflight issues on a static GitHub Pages site, but the browser cannot read the server response. The page treats a dispatched request as submitted.
