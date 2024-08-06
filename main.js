function onScanSuccess(decodedText) {
    // Extract expiration date from the decoded text
    const expirationDateMatch = decodedText.match(/Expires:\s*(\d{4}-\d{2}-\d{2})/);
    const memberEmail = decodedText.match(/Email:\s*([^\s,]+)/);
    
    if (expirationDateMatch) {
        const expirationDateStr = expirationDateMatch[1]; // Extract the date string
        const expirationDate = new Date(expirationDateStr); // Convert to Date object
        const currentDate = new Date(); // Current date
        
        // Check if the expiration date is valid
        const isNotExpired = expirationDate >= currentDate;
        
        // Update result and status based on expiration date
        const resultElement = document.getElementById('result');
        const statusElement = document.getElementById('status');
        
        if (isNotExpired) {
            resultElement.innerHTML = `
                <span style="color: green; background-color: #d4edda; padding: 10px; border-radius: 5px;">
                    Email: ${memberEmail}<br>
                    Valid until: ${expirationDateStr}
                </span>
            `;
            statusElement.innerText = 'Verified';
            statusElement.style.color = 'green';
        } else {
            resultElement.innerHTML = `
                <span style="color: red; background-color: #f8d7da; padding: 10px; border-radius: 5px;">
                    Email: ${memberEmail}<br>
                    QR Code Has Expired.
                </span>
            `;
            statusElement.innerText = 'Expired';
            statusElement.style.color = 'red';
        }
    } else {
        // Handle case where expiration date is not found
        document.getElementById('result').innerText = 'Invalid QR Code.';
    }
}

// Function to handle scan errors
function onScanError(errorMessage) {
    console.error(`QR Code Scan Error: ${errorMessage}`);
}

// Initialize the QR code scanner
document.addEventListener('DOMContentLoaded', function() {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanError
    ).catch(err => {
        console.error(`QR Code Scanner Error: ${err}`);
    });
});