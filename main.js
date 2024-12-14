import * as Sections from "./section-data.js"
import * as Navigation from "./section-navigation.js"
import {DataInterface} from "./data_interface.js"

const grid_container = document.getElementById("grid_container")
const data_interface = new DataInterface();

async function create_grid_container(section) {
    await data_interface.update_data();
    while (grid_container.hasChildNodes()) {
        grid_container.removeChild(grid_container.firstChild)
    }

    for (let i = section.start; i <= section.end; i++) {
        let locker_button = document.createElement("button");
        locker_button.innerHTML = `${i}`;
        locker_button.className = `locker-button`;
        let locker_color = data_interface.get_locker_color(i);
        locker_button.style = `background-color: ${locker_color}`;
        locker_button.onclick = () => locker_onclick(i);
        grid_container.appendChild(locker_button)
    }

    grid_container.style.setProperty('--columns-count', `repeat(${section.width}, 1fr)`)
    grid_container.style.setProperty('--rows-count', `repeat(${section.height}, 1fr)`)
}

/**
 * If-else chain on what should be done on locker button click
 * @param {number} locker_num 
 */
function locker_onclick(locker_num) {
    if (data_interface.is_locker_confirmed(locker_num))
        alert(`Locker ${locker_num} is already reserved!`);
    else if (data_interface.is_locker_booked(locker_num)) 
        check_confirmation(locker_num);
    else
        book_locker(locker_num);
}

/**
 * Asks for user's email ID, makes booking and sends confirmation mail
 * @param {number} locker_num locker number
 * @returns {null}
 */
function book_locker(locker_num) {
    // **ASK ABOUT PRIVACY RIGHTS IN PROMPT**
    var email_id = prompt("Please type in your email ID. A confirmation code will be mailed to this ID.");
    if (email_id == null)
        return;
    data_interface.make_booking(locker_num, email_id);
    data_interface.send_confirmation_mail(locker_num);
    alert(`Locker ${locker_num} has been reserved by ${email_id}! Click on the locker again to enter confirmation code and confirm booking.`);
}

/**
 * Asks user for confirmation code and if it is correct then confirms booking and updates database
 * @param {number} locker_num locker number
 */
function check_confirmation(locker_num) {
    var code = parseInt(prompt("Please type in the confirmation code mailed to the registered email ID:"));
    if (data_interface.is_code_correct(locker_num, code)) {
        data_interface.set_locker_as_confirmed(locker_num);
        alert("Code is correct. Locker booking is confirmed!");
    }
    else
        alert("Incorrect code! Locker booking remains unconfirmed.");
}

Navigation.NavigationObserver(function(sId){create_grid_container(Sections.getSectionViaIndex(sId))})