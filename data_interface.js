const sheet_id = "131TxjV7aCP97IbQNBEMJJzb-X6CXoGj1hrN0_yAPiRc";
const api_key = "AIzaSyB5RlCToszC9vbp3iP6mQjTPn7YnreeduU";
const discovery_docs = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const range1 = "4th Floor!A2:B86";
const range2 = "5th Floor!A2:B234";
const range3 = "6th Floor!A2:B73";
const write_script_url = 'https://script.google.com/macros/s/AKfycbzqFsVWTx0x2DNfuq5l8jzZ-QzS0G7NNDnsL868uUgiO2nKyYaAOQVHAyZP4kXFCDbp/exec';
const mail_script_url = 'https://script.google.com/macros/s/AKfycbyDTUpWiHXwRa3kpUySpj8XmD11TmQxoAcddtUWkV-QTM4fAfRHPS2o_mhMYxi2aDw5/exec';

/** A 2D array, subarrays in format [locker_number, name] as strings */
var raw_data = [[]];

/**
 * Initializes the GAPI Client library, that will be used to read sheets
 * @returns {null}
*/
async function init() {
    return new Promise((resolve, reject) => {
        gapi.load('client', () => {
            gapi.client.init({
                discoveryDocs: [discovery_docs],
                apiKey: api_key
            }).then(resolve).catch(reject);
        });
    });
}

/**
 * Reads the Sheets database (both 4th and 5th Floor) and stores raw data 
 * (in JSON format) to `raw_data` array
 */
async function read_raw_sheet() {
    try {
        gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: sheet_id,
            ranges: [range1, range2, range3]
        })
        .then((response) => {
            raw_data = response.result.valueRanges[0].values;
            raw_data = raw_data.concat(response.result.valueRanges[1].values);
            raw_data = raw_data.concat(response.result.valueRanges[2].values)
        })
    } catch (err) {
        console.log(err);
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
        await this._build_data();
    }

    /**Converts `raw_data` into `locker_data` objects stored in `data` array */
    async _build_data() {
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
    async make_booking(locker_num, name, group, email, duration, payment_method, date) {
        
        await this.update_data();
        if (this.is_locker_booked(locker_num)) {
            alert(`Locker ${locker_num} can't be booked since it is already reserved!`);
            return;
        }
        else {
            const post_data = {
                locker_num: locker_num, 
                name: name, 
                group: group, 
                email: email,
                date: date,
                duration: duration,
                payment_method: payment_method
            };
            
            this.data[locker_num] = new locker_data(locker_num, true);
            
            console.log(JSON.stringify(post_data));

            fetch(write_script_url, {
                mode: 'no-cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post_data)
            })

            await this.send_confirmation_mail(locker_num, email, name, group, duration, payment_method);
        }
    }

    /**
     * Send a mail to the provided user email ID, which contains the confirmation 
     * code. **Text of mail needs to be updated on Google Apps Script, in Ressu 
     * Coding Club's gmail account**
     * @param {number} locker_num locker number
     */
    async send_confirmation_mail(locker_num, email_id, name, group, duration, payment_method) {
        await this.update_data();
        if (this.is_locker_booked(locker_num)) {
            alert(`Locker ${locker_num} can't be booked since it is already reserved!`);
            return;
        }
        else {
            const post_data = {
                recipient: email_id,
                name: name,
                group: group,
                locker_num: locker_num,
                duration: duration,
                payment_method: payment_method
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
}