// ASTRONAVIRA Booking Form Handler - Copy entire code to Apps Script editor
function doPost(e) {
  try {
    // Define the sheet name where data will be stored
    const SHEET_NAME = 'Bookings';
    
    // Log the entire event object for debugging
    console.log('=== doPost called ===');
    console.log('Event object:', JSON.stringify(e));
    
    // Initialize data object
    var data = {};
    
    // Check if we have post data
    if (e && e.postData && e.postData.contents) {
      console.log('Post data contents:', e.postData.contents);
      try {
        // Try to parse as JSON first
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // If not JSON, try to parse as URL-encoded
        const params = e.postData.contents.split('&');
        params.forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            data[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }
    } else if (e && e.parameter) {
      // If no post data but we have parameters, use those
      data = e.parameter;
    }
    
    // Log the parsed data
    console.log('Parsed data:', JSON.stringify(data));

    // Validate required fields
    const requiredFields = ['name', 'email', 'dob', 'tob', 'pob', 'serviceType'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return sendResponse(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Get the spreadsheet and specified sheet
    // Replace SPREADSHEET_ID with your actual Google Sheet ID
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Get this from your Google Sheet URL
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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