# Tutorial on Managing I/O with Google Sheets through API

* **Note: This does not work with the school email ID (@edu.hel.fi) due to API usage restrictions. It is advisable to use a regular gmail ID.**
* *Feel free to use AI tools to explain certain steps in this procedure.*
* **Recheck the usage of CORS module from web sources before deployment (important only for writing data).**
* **Disclaimer:** It is not guaranteed that this code and procedure will work always. Make sure to check important details and permissions before deploying.

## Initial Setup:
* On [Google Console](https://console.cloud.google.com/), sign up with a regular account and create a 'New Project' in 'APIs and Services'. (Make sure to connect the Sheets API, at some point in this creation procedure.)
*  Create an API key from the 'Credentials' tab. Also get the ID of the spreadsheet you want to read from. 

## Reading Data:
* Reading data from Sheets makes use of GAPI.
* Make sure the spreadsheet is **visible** to 'Anyone with the link' for this to work.
* Simply use the code from the file `read-from-sheets.html`, and add your API_KEY and SPREADSHEET_ID in the required places. The contained script provides a `getSheetData()` function. This is helpful in extracting data from Sheets in a 2D array form.

## Writing Data:
* Writing data makes use of Google Apps Script. For this, you need to sign in to [Google Apps Script](https://script.google.com/u/1/home) and create a 'New Project'. The same code from `apps-script-write.txt` can be pasted to Apps Script editor and then deployed, with web app access set to 'Anyone'. *This is important for allowing the JS to edit Sheets without requiring sign-in from the user.*
* Make sure the spreadsheet is **editable** by 'Anyone with the link' for this to work.
* To send a 'trigger' to run this writing Apps Script, we send a HTTP(S) request from JS. This is done by the code in `write-to-sheets.html`. This sent request also contains the data that is to be written. 