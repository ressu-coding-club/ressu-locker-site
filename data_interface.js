const sheet_id = "1GjgwX92w88Y92F4F7-u7jZzSbu2-XVf0GUNu7zWXkCU";
const api_key = "AIzaSyB5RlCToszC9vbp3iP6mQjTPn7YnreeduU";
const discovery_docs = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const client_id = "298203617666-1q011fl95e6u5rufsaek1voga7j6m2cp.apps.googleusercontent.com";
const range1 = "4th Floor!A2:D86";
const range2 = "5th Floor!A2:D205";
const scope = "https://www.googleapis.com/auth/spreadsheets";
const write_script_url = 'https://script.google.com/macros/s/AKfycbztIJH-GHg5GoknHR2VN51ROZqH9V1J0GxZ8x1AO7yKu4zUdZtGr7LnOJq3K69VNUiL9A/exec';
const mail_script_url = 'https://script.google.com/macros/s/AKfycbydynGu3lT8WXgN9jOXLlzGA-jf2vmlYN_zkHq0rkKLwFsXjxVldDUCmlSSpKbHiGJq-g/exec';
const min_locker_num = 1, max_locker_num = 100;

/** A 2D array, subarrays in format [locker_number, username] as strings */
var raw_data = [[]];

/**
 * Initializes the GAPI Client library, that will be used to read sheets
 * @returns {null}
*/
async function init() {
    const load = new Promise( function(resolve, reject) {
        gapi.load('client', resolve);
    })
    return load.then(async () => {
        return await gapi.client.init({
            discoveryDocs: [discovery_docs],
            apiKey: api_key
        })
    })
}

/**
 * Reads the Sheets database (both 4th and 5th Floor) and stores raw data 
 * (in JSON format) to `raw_data` array
 */
async function read_raw_sheet() {
    try {
        gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: sheet_id,
            ranges: [range1, range2]
        })
        .then((response) => {
            raw_data = response.result.valueRanges[0].values;
            raw_data = raw_data.concat(response.result.valueRanges[1].values);
        })
        .catch(err => {console.log(err)})
    }
    catch {
        await init();
        await read_raw_sheet();
    }
}

export class locker_data {
    /**This locker's number */
    locker_number = 0;
    /**Username that booked it (same as email ID) */
    username = "";
    /**Whether booking is confirmed */
    booking_confirmed = false;
    /**Secret confirmation code */
    confirmation_code = 0;

    constructor(locker_number, username, confirmation_code, booking_confirmed) {
        this.locker_number = locker_number;
        this.username = username;
        this.booking_confirmed = booking_confirmed;
        this.confirmation_code = confirmation_code;
    }
}

export class DataInterface {
    /** A dictionary(map) locker number (int) to corresponding `locker_data` object */
    data = {};

    constructor() {
        this.update_data();
    }

    /**Read raw data from sheet and update the `raw_data` array */
    async update_data() {
        await read_raw_sheet();
        this._build_data();
    }

    /**Converts `raw_data` into `locker_data` objects stored in `data` array */
    _build_data() {
        const locker_col = 0, username_col = 1, code_col = 2, confirm_col = 3;

        var n = raw_data.length;
        for (let i = 0; i < n; ++i) {
            let locker_number = parseInt(raw_data[i][locker_col]);
            let username = raw_data[i][username_col];
            let code = raw_data[i][code_col];
            let is_confirmed = raw_data[i][confirm_col];
            this.data[locker_number] = new locker_data(locker_number, username, code, is_confirmed);
        }
    }

    /** Checks in `data` if booking of `locker_num` is confirmed
     * @param {number} locker_num
     * @returns {boolean} Whether the locker booking is confirmed
    */
    is_locker_confirmed(locker_num) {
        if (this.data[locker_num])
            return this.data[locker_num].booking_confirmed == "TRUE"
        else
            return false
    }

    /** Checks in `data` if `locker_num` is booked (i.e. has an associated username)
     * @param {number} locker_num
     * @returns {boolean} Whether the locker is booked (unconfirmed is also true)
    */
    is_locker_booked(locker_num) {
        if (this.data[locker_num])
            return this.data[locker_num].username != 'FREE'
        else
            return false
    }

    /** Returns `hex` color of locker as a string
     * Free = green;
     * Booked but not confirmed = Yellow;
     * Booked and confirmed = Red
     * @param {number} locker number
     * @returns {str} color of locker in hex format
    */
    get_locker_color(locker_num) {
        const green = "#75ee75", yellow = "#f0bd7c", red = "#f07c7c"
        if (!this.is_locker_booked(locker_num))
            return green;
        else {
            if (this.is_locker_confirmed(locker_num))
                return red;
            else
                return yellow;
        }
    }

    /**Randomly chooses a **4 digit** confirmation code
     * @returns {number}
     */
    _get_random_code() {
        return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    }

    /**
     * Updates all data, checks if locker is booked,
     * then generates random code, updates `this.data` and writes it to the database
     * @param {number} locker_num locker number
     * @param {string} username email ID of user
     * @returns {null}
     */
    make_booking(locker_num, username) {
        this.update_data();
    
        if (this.is_locker_booked(locker_num))
            return false;
    
        let code = this._get_random_code();
        const post_data = {
            locker_num: locker_num, 
            username: username, 
            code: code, 
            booking_confirmed: false
        };
        
        this.data[locker_num] = new locker_data(locker_num, username, code, false);
        fetch(write_script_url, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_data)
        })
    }

    /**
     * Checks if the confirmation code given by user matches with the one in the
     * database
     * @param {number} locker_num locker number
     * @param {number} code confirmation that has been entered by user
     * @returns {boolean}
     */
    is_code_correct(locker_num, code) {
         return this.data[locker_num].confirmation_code == code;
    }

    /**
     * Marks a locker booking as confirmed in `this.data`, and then update
     * Sheets database accordingly
     * @param {number} locker_num locker number
     */
    set_locker_as_confirmed(locker_num) {
        this.data[locker_num].booking_confirmed = true;

        const post_data = {
            locker_num: locker_num, 
            username: this.data[locker_num].username, 
            code: this.data[locker_num].confirmation_code, 
            booking_confirmed: true
        };

        fetch(write_script_url, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_data)
        })
    }

    /**
     * Send a mail to the provided user email ID, which contains the confirmation 
     * code. **Text of mail needs to be updated on Google Apps Script, in Ressu 
     * Coding Club's gmail account**
     * @param {number} locker_num locker number
     */
    send_confirmation_mail(locker_num) {
        const post_data = {
            recipient: this.data[locker_num].username,
            locker_num: locker_num,
            confirmation_code: this.data[locker_num].confirmation_code
        }
        fetch(mail_script_url, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_data)
        })
    }
}

function test() {
    var di = new DataInterface();
    console.log(di.data);
}

// window.onload = test;