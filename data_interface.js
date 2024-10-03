const sheet_id = "1GjgwX92w88Y92F4F7-u7jZzSbu2-XVf0GUNu7zWXkCU";
const api_key = "AIzaSyB5RlCToszC9vbp3iP6mQjTPn7YnreeduU";
const discovery_docs = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const client_id = "298203617666-1q011fl95e6u5rufsaek1voga7j6m2cp.apps.googleusercontent.com";
const range = "raw_data!A2:B101";
const scope = "https://www.googleapis.com/auth/spreadsheets";
const script_url = "https://script.google.com/macros/s/AKfycbz_4Go6KCzvnn_U0c7sT5qF72PcsITP1gr0lVZEMVTg2bSQQS_yvDtq35UQGNXrXMVN/exec";
const locker_col = 0, username_col = 1;
const min_locker_num = 1, max_locker_num = 100;

var raw_data = [[]]; // 2d array, subarrays in format [locker_number, username] as strings
var data = {} // dictionary mapping locker number (int) to username if available, else null

// Initializing GAPI Client
function init_gapi_client() {
    gapi.client.init({
        discoveryDocs: [discovery_docs],
        apiKey: api_key
    }).then(() => {
        read_sheet(); 
    }).catch((error) => {
        console.error("Error during GAPI client initialization:", error);
    })
}

// Load GAPI Client library and initialize it
function load_gapi_client() {
    /**Initializes GAPI client, then calls `read_sheet` to extract data, which in turn calls `build_data` */
    gapi.load('client', init_gapi_client);
}

// Read data from sheet
function read_sheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheet_id,
        range: range
    }).then((response) => {
        raw_data = response.result.values;
        // console.log(raw_data);
        build_data();
    }).catch((error) => {
        console.error("Error fetching sheet data:", error);
    })
}

function build_data() {
    /**Uses `raw_data` to build the dictionary `data`
     * in key-value format `locker_number : username`
    */
    var n = raw_data.length;
    for (let i = min_locker_num; i <= max_locker_num; ++i) {
        data[i] = null;
    }

    for (let i = 0; i < n; ++i) {
        let locker_number = parseInt(raw_data[i][locker_col]);
        data[locker_number] = raw_data[i][username_col];
    }

    // console.log(data);
}

function is_locker_booked(locker_num) {
    /**Checks in `data` if `locker_num` is booked
     * Return true if booked and false otherwise
     * WILL NOT WORK IF `build_data` HAS NOT BEEN RUN
     */
    return (data[locker_num] != null);
}

// THIS FUNCTION STILL HAS ERRORS
/* function save_locker_as_booked(locker_num, username) {
    let post_data = {locker_num: locker_num, username: username};
    fetch(script_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post_data)
    })
    .then(() => console.log('Request sent successfully'))
    .catch(err => console.error('Request failed', err));
}*/

/* function test() {
    load_gapi_client();
    console.log(is_locker_booked(2));
    // save_locker_as_booked(2, "def.pqr@org.com");
    console.log(is_locker_booked(2));
}*/ 

window.onload = load_gapi_client;