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
    if (data_interface.is_locker_booked(locker_num))
        alert(`Locker ${locker_num} is already reserved!`);
    else
        book_locker(locker_num);
}

/**
 * Asks for user's email ID, makes booking and sends confirmation mail
 * @param {number} locker_num locker number
 * @returns {null}
 */
function book_locker(locker_num) {
    var prompt_text = `You are booking locker number ${locker_num}. Please type in your full name. `;
    prompt_text += "This will be stored in our database to associate your locker number with you.";
    var name = prompt(prompt_text);
    if (name == null) {
        alert("We didn't catch that. Please try again!");
        return;
    }

    var group = prompt("Please enter your group. For example, 23DPA");
    if (group == null) {
        alert("We didn't catch that. Please try again!");
        return;
    }

    data_interface.make_booking(locker_num, name, group);

    prompt_text = `Congratulations! You have booked locker ${locker_num}. `;
    prompt_text += "If you wish to receive a confirmation email with your booking details, please enter your email ID below. This will only be used to send you a confirmation mail.";
    var email_id = prompt(prompt_text);

    data_interface.send_confirmation_mail(locker_num, email_id, name, group);
    alert(`Email has been sent to ${email_id}.`);
}

Navigation.NavigationObserver(function(sId){create_grid_container(Sections.getSectionViaIndex(sId))})