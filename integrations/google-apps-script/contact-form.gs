const CONFIG = {
  notificationEmail: 'richard.luo.bp@gmail.com',
  spreadsheetId: '',
  sheetName: 'COSKY.AI Project Contacts',
  emailSubject: 'real estate Ai lab 项目联系'
};

function doPost(e) {
  const payload = parsePayload_(e);
  const validationError = validatePayload_(payload);

  if (validationError) {
    return json_({ ok: false, error: validationError });
  }

  const submittedAt = new Date();
  const message = buildMessage_(payload);
  const lock = LockService.getScriptLock();

  lock.waitLock(10000);
  let serialNumber;
  try {
    const sheet = getSheet_();
    serialNumber = getNextSerialNumber_(sheet);

    sheet.appendRow([
      serialNumber,
      submittedAt,
      payload.name || '',
      payload.email || '',
      payload.message || '',
      '',
      ''
    ]);
  } finally {
    lock.releaseLock();
  }

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

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object') return 'invalid_payload';
  if (!payload.email || !String(payload.email).includes('@')) return 'email_required';
  if (!payload.message || !String(payload.message).trim()) return 'message_required';
  return '';
}

function getSheet_() {
  const spreadsheet = CONFIG.spreadsheetId
    ? SpreadsheetApp.openById(CONFIG.spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(CONFIG.sheetName) || spreadsheet.getSheets()[0];
}

function getNextSerialNumber_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const maxSerial = values.reduce((max, value) => {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 1000000) return max;
    return Math.max(max, number);
  }, 0);

  return maxSerial + 1;
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
