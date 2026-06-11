const CONFIG = {
  notificationEmail: 'richard.luo.bp@gmail.com',
  sheetName: 'COSKY.AI Project Contacts',
  emailSubject: 'real estate Ai lab 项目联系'
};

function doPost(e) {
  const payload = parsePayload_(e);

  if (payload.website) {
    return json_({ ok: true, ignored: true });
  }

  const submittedAt = new Date();
  const row = [
    submittedAt,
    payload.name || '',
    payload.email || '',
    payload.message || '',
    payload.source || '',
    payload.createdAt || ''
  ];

  const sheet = getSheet_();
  sheet.appendRow(row);

  MailApp.sendEmail({
    to: CONFIG.notificationEmail,
    subject: CONFIG.emailSubject,
    body: [
      'COSKY.AI 网站收到新的项目联系信息。',
      '',
      `Name: ${payload.name || ''}`,
      `Email: ${payload.email || ''}`,
      `Message: ${payload.message || ''}`,
      `Source: ${payload.source || ''}`,
      `Submitted at: ${submittedAt.toISOString()}`
    ].join('\n'),
    replyTo: payload.email || CONFIG.notificationEmail
  });

  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, service: 'COSKY.AI contact form' });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
    sheet.appendRow(['Received At', 'Name', 'Email', 'Message', 'Source', 'Client Created At']);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

