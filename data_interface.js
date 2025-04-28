const sheet_id = "131TxjV7aCP97IbQNBEMJJzb-X6CXoGj1hrN0_yAPiRc";
const api_key = "AIzaSyB5RlCToszC9vbp3iP6mQjTPn7YnreeduU";
const discovery_docs = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const range1 = "4th Floor!A2:B86";
const range2 = "5th Floor!A2:B205";
const write_script_url = 'https://script.google.com/macros/s/AKfycbwFdldiQJKSISvITusPnOR3_gNFvstuF9rhd3OHh3BJfKGdNx5XkX7HwIbxaskjY3hq/exec';
const mail_script_url = 'https://script.google.com/macros/s/AKfycbwO9IYuvfbQNv-88dn2awwGFtsSivZNcJp-GadcwZdX6Y24NavYR1GiBawG2PtnIqqI/exec';

/** A 2D array, subarrays in format [locker_number, name] as strings */
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
    /**Whether locker is booked */
    is_booked = false;

    constructor(locker_number, is_booked) {
        this.locker_number = locker_number;
        this.is_booked = is_booked;
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
        const locker_col = 0, name_col = 1;

        var n = raw_data.length;
        for (let i = 0; i < n; ++i) {
            let locker_number = parseInt(raw_data[i][locker_col]);
            let name = raw_data[i][name_col];
            this.data[locker_number] = new locker_data(locker_number, name!='FREE');
        }
    }

    is_locker_booked(locker_num) {
        if (this.data[locker_num])
            return this.data[locker_num].is_booked;
        else
            return false
    }

    /** Returns `hex` color of locker as a string
     * Free = green;
     * Booked = red
     * @param {number} locker number
     * @returns {str} color of locker in hex format
    */
    get_locker_color(locker_num) {
        const green = "#75ee75", red = "#f07c7c"
        return this.is_locker_booked(locker_num)? red : green;
    }

    /**
     * Updates all data, checks if locker is booked,
     * then generates random code, updates `this.data` and writes it to the database
     * @param {number} locker_num locker number
     * @param {string} name email ID of user
     * @returns {null}
     */
    make_booking(locker_num, name, group) {
        this.update_data();
    
        if (this.is_locker_booked(locker_num))
            return false;

        const post_data = {
            locker_num: locker_num, 
            name: name, 
            group: group, 
        };
        
        this.data[locker_num] = new locker_data(locker_num, true);
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
    send_confirmation_mail(locker_num, email_id, name, group) {
        const post_data = {
            recipient: email_id,
            name: name,
            group: group,
            locker_num: locker_num
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