import * as Sections from "./section-data.js"
import * as Navigation from "./section-navigation.js"
import {DataInterface} from "./data_interface.js"

const grid_container = document.getElementById("grid_container")
const data_interface = new DataInterface();

async function create_grid_container(section) {
    if (section.start == 0 && section.end == 0) {
        let loading_text = "Green lockers are available to book, while red ones are blocked! Once you select a suitable locker, use the form on the right to make a booking. Click on the right arrow below to start browsing..."
        grid_container.innerHTML = `<div id="loading_box">${loading_text}</div>`;
        return;
    }

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

form.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    var name = formData.get("name");
    var group = formData.get("group");
    var email = formData.get("email");
    var locker_num = parseInt(formData.get("locker_num"));
    var duration = formData.get("duration");
    var payment_mode = formData.get("payment");
    var consent = formData.get("consent");

    if (!consent)
        alert("Please check the consent box to complete your booking!");
    else if (locker_num<401)
        alert("Locker number is invalid. Please choose a green locker from the grid.");
    else if (locker_num>485 && locker_num<501)
        alert("Locker number is invalid. Please choose a green locker from the grid.");
    else if (locker_num>733 && locker_num<800)
        alert("Locker number is invalid. Please choose a green locker from the grid.");
    else if (locker_num>871)
        alert("Locker number is invalid. Please choose a green locker from the grid.");
    else if (data_interface.is_locker_booked(locker_num))
        alert(`Locker ${locker_num} is can't be booked since it is already reserved!`);
    else
        book_locker(locker_num, name, group, email, duration, payment_mode);

    console.log(name, group, email, duration, locker_num);
});

// function handle_form_data(locker_num, )

/**
 * If-else chain on what should be done on locker button click
 * @param {number} locker_num 
 */
function locker_onclick(locker_num) {
    if (data_interface.is_locker_booked(locker_num))
        alert(`Locker ${locker_num} is can't be booked since it is already reserved!`);
    else
        document.getElementById("locker_num").value = locker_num;
        // book_locker(locker_num);
}

/**
 * Asks for user's email ID, makes booking and sends confirmation mail
 * @param {number} locker_num locker number
 * @returns {null}
 */
async function book_locker(locker_num, name, group, email, duration, payment_method) {
    await data_interface.update_data();
    if (data_interface.is_locker_booked(locker_num)) {
        alert(`Locker ${locker_num} can't be booked since it is already reserved!`);
    }
    else {
        var date = new Date();
        await data_interface.make_booking(locker_num, name, group, email, duration, payment_method, date);

        /*await data_interface.send_confirmation_mail(locker_num, email, name, group, duration, payment_method);*/
        alert(`Congrulations! You have booked locker number ${locker_num}. An email with payment details has been sent to ${email}.`);
    }
}

Navigation.NavigationObserver(async function(sId){
    await data_interface.update_data();
    await create_grid_container(Sections.getSectionViaIndex(sId));
});