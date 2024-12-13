import * as Sections from "./section-data.js"
import * as Navigation from "./section-navigation.js"
import {DataInterface} from "./data_interface.js"

const grid_container = document.getElementById("grid_container")
const data_interface = new DataInterface();

function create_grid_container(section) {
    data_interface.update_data();
    while (grid_container.hasChildNodes()) {
        grid_container.removeChild(grid_container.firstChild)
    }

    for (let i = section.start; i <= section.end; i++) {
        let locker_button = document.createElement("button");
        locker_button.innerHTML = `${i}`;
        locker_button.className = `locker-button`;
        let locker_color = data_interface.get_locker_color(i);
        console.log(i, locker_color);
        locker_button.style = `background-color: ${locker_color}`;
        locker_button.onclick = () => { console.log(`Reserved locker number ${i}`) }
        grid_container.appendChild(locker_button)
    }

    grid_container.style.setProperty('--columns-count', `repeat(${section.width}, 1fr)`)
    grid_container.style.setProperty('--rows-count', `repeat(${section.height}, 1fr)`)
}

Navigation.NavigationObserver(function(sId){create_grid_container(Sections.getSectionViaIndex(sId))})