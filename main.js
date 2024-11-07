import * as Sections from "./section-data.js"

const grid_container = document.getElementById("grid_container")

function create_grid_container(section) {
    while (grid_container.hasChildNodes()) {
        grid_container.removeChild(grid_container.firstChild)
    }

    for (let i = section.start; i <= section.end; i++) {
        let locker_button = document.createElement("button");
        locker_button.innerHTML = `${i}`;
        locker_button.onclick = () => { console.log(`Reserved locker number ${i}`) }
        grid_container.appendChild(locker_button)
    }

    grid_container.style.setProperty('--columns-count', `repeat(${section.width}, 1fr)`)
    grid_container.style.setProperty('--rows-count', `repeat(${section.height}, 1fr)`)
}



// test
create_grid_container(Sections.getSectionViaIndex(4))
