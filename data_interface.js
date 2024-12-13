const sheet_id = "1GjgwX92w88Y92F4F7-u7jZzSbu2-XVf0GUNu7zWXkCU";
const api_key = "AIzaSyB5RlCToszC9vbp3iP6mQjTPn7YnreeduU";
const discovery_docs = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const client_id = "298203617666-1q011fl95e6u5rufsaek1voga7j6m2cp.apps.googleusercontent.com";
const range = "raw_data!A2:D501";
const scope = "https://www.googleapis.com/auth/spreadsheets";
const script_url = 'https://script.google.com/macros/s/AKfycbx4406Pugk2ic3NikxWkNVRJsJi3bkYWWb36yJ7RPYSHnDb0RWBTYXfm6aqwePj9RsLjg/exec';
const min_locker_num = 1, max_locker_num = 100;

/** A 2D array, subarrays in format [locker_number, username] as strings */
var raw_data = [[]];

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

async function read_raw_sheet() {
    try {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheet_id,
            range: range
        }).then((response) => {
            raw_data = response.result.values;
        })
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

    get raw_data() {
        return raw_data;
    }

    /**Read raw data from sheet and update the `raw_data` array */
    async update_data() {
        await read_raw_sheet();
        this._build_data();
        console.log(this.data);
    }

    /**Converts `raw_data` into `locker_data` objects stored in `data` array */
    _build_data() {
        const locker_col = 0, username_col = 1, code_col = 2, confirm_col = 3;

        var n = raw_data.length;
        for (let i = min_locker_num; i <= max_locker_num; ++i) {
            this.data[i] = null;
        }
    
        for (let i = 0; i < n; ++i) {
            let locker_number = parseInt(raw_data[i][locker_col]);
            let username = raw_data[i][username_col];
            let code = raw_data[i][code_col];
            let is_confirmed = raw_data[i][confirm_col];
            this.data[locker_number] = new locker_data(locker_number, username, code, is_confirmed);
        }   
    }

    /** Checks in `data` if `locker_num` is booked 
     * @param {number} locker_num
     * @returns {boolean} Whether the locker is booked (unconfirmed is also true)
    */
    is_locker_booked(locker_num) {
        return (this.data[locker_num] != null)
    }

    /** Returns `hex` color as string of locker 
     * Free = green;
     * Booked but not confirmed = Yellow;
     * Booked and confirmed = Red
     * @param {number} locker_num
     * @returns {str} color of locker in hex format
    */
    get_locker_color(locker_num) {
        const green = "#75ee75", yellow = "#f0bd7c", red = "#f07c7c"
        if (!this.is_locker_booked(locker_num))
            return green;
        else {
            if (this.data[locker_num].booking_confirmed == "TRUE")
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

    attempt_booking(locker_num, username) {
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

        fetch(script_url, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_data)
        })
        .then(() => {
            this.data[locker_num] = locker_data(locker_num, username, code, false);
            return true;  
        })
        .catch(err => console.error('Request failed', err));
    }
}

function test() {
    read_raw_sheet()
    .then(() => {
        if (raw_data.length > 1)
            console.log(raw_data);
        else {
            read_raw_sheet().then(console.log(raw_data));
        }
    });
}

// window.onload = test;