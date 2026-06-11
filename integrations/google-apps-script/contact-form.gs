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

  const sheet = getSheet_();
  const submittedAt = new Date();
  const serialNumber = getNextSerialNumber_(sheet);
  const message = buildMessage_(payload);

  sheet.appendRow([
    serialNumber,
    submittedAt,
    payload.name || '',
    payload.email || '',
    payload.message || '',
    '',
    ''
  ]);

  MailApp.sendEmail({
    to: CONFIG.notificationEmail,
    subject: CONFIG.emailSubject,
    body: [
      'COSKY.AI 网站收到新的项目联系信息。',
      '',
      `序号: ${serialNumber}`,
      `日期时间: ${submittedAt.toISOString()}`,
      `姓名: ${payload.name || ''}`,
      `邮箱: ${payload.email || ''}`,
      `填写的信息: ${message}`,
      `来源页面: ${payload.source || ''}`
    ].join('\n'),
    replyTo: payload.email || CONFIG.notificationEmail
  });

  return json_({ ok: true, serialNumber });
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
  return spreadsheet.getSheetByName(CONFIG.sheetName) || spreadsheet.getSheets()[0];
}

function getNextSerialNumber_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;

  const lastValue = sheet.getRange(lastRow, 1).getValue();
  const lastNumber = Number(lastValue);
  if (Number.isFinite(lastNumber) && lastNumber > 0) {
    return lastNumber + 1;
  }

  return lastRow;
}

function buildMessage_(payload) {
  const parts = [];
  if (payload.name) parts.push(`姓名：${payload.name}`);
  if (payload.message) parts.push(`信息：${payload.message}`);
  return parts.join('\n');
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
