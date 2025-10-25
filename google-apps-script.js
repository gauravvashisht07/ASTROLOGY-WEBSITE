// Google Apps Script code - Save this in your Google Apps Script editor
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // Add timestamp and payment status
  const timestamp = new Date();
  const paymentStatus = "Pending";
  
  // Add row to sheet
  sheet.appendRow([
    timestamp,
    data.name,
    data.dob,
    data.tob,
    data.pob,
    data.currentLocation,
    data.email,
    data.phone,
    data.message,
    data.serviceType,
    paymentStatus
  ]);
  
  // Send email confirmation
  const emailBody = `
    Dear ${data.name},
    
    Thank you for booking a consultation with AstroVision. We have received your booking for ${data.serviceType}.
    
    Your consultation details:
    Date of Birth: ${data.dob}
    Time of Birth: ${data.tob}
    Place of Birth: ${data.pob}
    
    Your report will be ready within 48 hours. We will contact you for any additional information if needed.
    
    Best regards,
    AstroVision Team
  `;
  
  MailApp.sendEmail({
    to: data.email,
    subject: "AstroVision Consultation Booking Confirmation",
    body: emailBody
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'Data successfully recorded'
  })).setMimeType(ContentService.MimeType.JSON);
}