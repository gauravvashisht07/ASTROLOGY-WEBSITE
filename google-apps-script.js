// ASTRONAVIRA Booking Form Handler - Copy entire code to Apps Script editor
function doPost(e) {
  try {
    // Define the sheet name where data will be stored
    const SHEET_NAME = 'Bookings';  // You can change this to match your sheet name
    
    // Log incoming data for debugging
    console.log('Received data:', e.postData ? e.postData.contents : 'No post data', 
                'Parameters:', e.parameter ? JSON.stringify(e.parameter) : 'No parameters');

    // Parse the request data - support JSON and form-encoded posts
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // not JSON, fall back to parameters (form posts)
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'dob', 'tob', 'pob', 'serviceType'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return sendResponse(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Get the spreadsheet and specified sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange('A1:K1').setValues([['Timestamp', 'Name', 'Date of Birth', 'Time of Birth', 
        'Place of Birth', 'Current Location', 'Email', 'Phone', 'Message', 'Service Type', 'Payment Status']]);
    }
    
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
      data.currentLocation || '',
      data.email,
      data.phone || '',
      data.message || '',
      data.serviceType,
      paymentStatus
    ]);
    
    // Send email confirmation
    const emailBody = `
      Dear ${data.name},
      
      Thank you for booking a consultation with ASTRONAVIRA. We have received your booking for ${data.serviceType}.
      
      Your consultation details:
      Date of Birth: ${data.dob}
      Time of Birth: ${data.tob}
      Place of Birth: ${data.pob}
      
      Your report will be ready within 48 hours. We will contact you for any additional information if needed.
      
      Best regards,
      ASTRONAVIRA Team
    `;
    
    MailApp.sendEmail({
      to: data.email,
      subject: "ASTRONAVIRA Consultation Booking Confirmation",
      body: emailBody
    });
    
  return sendResponse(200, 'Booking successfully recorded');
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return sendResponse(500, 'Internal server error');
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Service running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendResponse(code, message) {
  const response = {
    status: code === 200 ? 'success' : 'error',
    message: message
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}