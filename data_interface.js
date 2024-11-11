const sheet_id = "1GjgwX92w88Y92F4F7-u7jZzSbu2-XVf0GUNu7zWXkCU";
const api_key = "AIzaSyB5RlCToszC9vbp3iP6mQjTPn7YnreeduU";
const discovery_docs = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const client_id = "298203617666-1q011fl95e6u5rufsaek1voga7j6m2cp.apps.googleusercontent.com";
const range = "raw_data!A2:B501";
const scope = "https://www.googleapis.com/auth/spreadsheets";
const script_url = 'https://script.google.com/macros/s/AKfycbx4406Pugk2ic3NikxWkNVRJsJi3bkYWWb36yJ7RPYSHnDb0RWBTYXfm6aqwePj9RsLjg/exec';
const locker_col = 0, username_col = 1;
const min_locker_num = 1, max_locker_num = 100;

var raw_data = [[]]; // 2d array, subarrays in format [locker_number, username] as strings
var data = {} // dictionary mapping locker number (int) to username (str) if available, else null

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

// Convert raw data into map structure
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

// Load GAPI Client library, initialize client, build data map
function initialize() {
    return new Promise((resolve) => {
        /**Initializes GAPI client 
         * which calls `read_sheet` to extract data then
         * which calls `build_data` 
         * Returns a `promise` */
        gapi.load('client', init_gapi_client)
        resolve("");
    });
}

function is_locker_booked(locker_num) {
    /**Checks in `data` if `locker_num` is booked
     * Return true if booked and false otherwise
     * WILL NOT WORK IF `initialize` or `build_data` HAS NOT BEEN RUN
     */
    return (data[locker_num] != null);
}

// Updates data and saves a locker (if free) as booked in the database
function save_locker_as_booked(locker_num, username) {
    read_sheet();

    if (is_locker_booked(locker_num))
        return false;

    const post_data = {locker_num: locker_num, username: username};
    fetch(script_url, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post_data)
    })
    .then(() => {
        data[locker_num] = username;
        return true;  
    })
    .catch(err => console.error('Request failed', err));
}

function test() {
    initialize()
    .then (() => {
    console.log(is_locker_booked(2));
    save_locker_as_booked(631, "def.pqr@org.com");
    console.log(is_locker_booked(2));
    })
}

window.onload = initialize;