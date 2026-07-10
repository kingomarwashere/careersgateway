// ============================================================
// Careers Gateway — Google Apps Script Webhook
// Paste this into Extensions → Apps Script in your Google Sheet
// Deploy as: Web App → Execute as: Me → Access: Anyone
// ============================================================

const NOTIFY_EMAIL = 'Cgabijendra@gmail.com';
const SHEET_NAME   = 'Inquiries';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    appendToSheet(data);
    sendNotificationEmail(data);
    return ok();
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow CORS preflight
function doGet(e) {
  return ok();
}

function appendToSheet(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Date (AEST)', 'Full Name', 'Email', 'Phone',
      'Service', 'Course Name', 'CRICOS Code', 'Institution', 'Message', 'Source'
    ]);
    // Bold the header row
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#1a2744').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.submittedAt || new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }),
    data.fullName   || '',
    data.email      || '',
    data.phone      || '',
    data.service    || '',
    data.courseName || '',
    data.cricosCode || '',
    data.provider   || '',
    data.message    || '',
    data.source     || 'careersgateway.com.au',
  ]);
}

function sendNotificationEmail(data) {
  var subject = '🔔 New Inquiry: ' + (data.fullName || 'Unknown') + ' — ' + (data.service || 'General');
  var body =
    '<div style="font-family:Arial,sans-serif;color:#1a2744;max-width:560px">' +
    '<div style="background:#1a5bb8;padding:18px 24px;border-radius:6px 6px 0 0">' +
    '<h2 style="color:#fff;margin:0;font-size:1rem">New Inquiry — Careers Gateway Portal</h2>' +
    '</div>' +
    '<table style="width:100%;border-collapse:collapse;border:1px solid #e8f0fe;border-top:none">' +
    row('Name',        data.fullName) +
    row('Email',       '<a href="mailto:' + data.email + '">' + data.email + '</a>') +
    row('Phone',       data.phone || '—') +
    row('Service',     data.service || '—') +
    row('Course',      data.courseName ? data.courseName + (data.cricosCode ? ' (CRICOS: ' + data.cricosCode + ')' : '') : '—') +
    row('Institution', data.provider || '—') +
    row('Message',     data.message || '—') +
    row('Submitted',   data.submittedAt || new Date().toLocaleString('en-AU')) +
    '</table>' +
    '<div style="padding:16px;text-align:center">' +
    '<a href="mailto:' + data.email + '" style="background:#1a5bb8;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:bold">Reply to ' + (data.fullName||'').split(' ')[0] + '</a>' +
    '</div></div>';

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, '', { htmlBody: body, replyTo: data.email });
}

function row(label, value) {
  return '<tr><td style="padding:9px 16px;color:#64748b;font-size:.88rem;background:#f8faff;width:120px">' +
    label + '</td><td style="padding:9px 16px;font-size:.9rem">' + (value || '') + '</td></tr>';
}

function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
