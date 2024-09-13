let grid_container = document.getElementById("grid_container")

let locker_map = [
    [],
    [],
    [],
    [],
    [
        { size: 50, start: 500 },
        { size: 50, start: 550 },
        { size: 50, start: 600 },
        { size: 50, start: 500 },
        { size: 50, start: 500 },
        { size: 50, start: 500 },
        { size: 50, start: 500 },
        { size: 50, start: 500 },
        { size: 50, start: 500 },
        { size: 50, start: 500 },
        { size: 50, start: 500 },
    ],
    []
];

function create_grid_container(floor_index, section_index) {
    while (grid_container.hasChildNodes()) {
        grid_container.removeChild(grid_container.firstChild)
    }

    for (let i = 0; i < locker_map[floor_index][section_index].size; i++) {
        console.log("test")
        let locker_button = document.createElement("button")
        let locker_number = locker_map[floor_index][section_index].start + i + 1;
        locker_button.innerHTML = locker_number
        locker_button.onclick = () => { console.log(`You reserved locker number ${locker_map[floor_index][section_index].start + i + 1}`) }
        grid_container.appendChild(locker_button)
    }
}

create_grid_container(4, 1)
