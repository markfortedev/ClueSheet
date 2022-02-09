
const sheet = {
    guests: [
        "Mustard",
        "Plum",
        "Green",
        "Peacock",
        "Scarlet",
        "White"
    ],
    weapons: [
        "Knife",
        'Candlestick',
        "Pistol",
        "Trophy",
        "Rope",
        "Bat",
        "Ax",
        "Dumbbell"
    ],
    rooms: [
        "Hall",
        "Dining Room",
        "Kitchen",
        "Patio",
        "Observatory",
        "Theater",
        "Living Room",
        "Spa",
        "Guest House"
    ]
}

const PlayerCount = 6;

let currRow = 0;

let cells = []

let currentHighlightPlayer = null
let currentHighlightName = null
let currentHighlightedCell = null

let mobile = false

function setupTable(playerCount) {
    let table = document.getElementById("game-table")
    let playerNames = []
    for (let i = 0; i < playerCount; i++) {
        playerNames.push("P" + (i + 1))
    }
    let playerRow = createRow(playerCount, ["", ...playerNames], false, true, true)
    table.appendChild(playerRow)
    let suspectsHeading = createHeadingRow(playerCount, "Suspects")
    table.appendChild(suspectsHeading)
    sheet.guests.forEach(guest => {
        let row = createRow(playerCount, [guest], true)
        table.appendChild(row)
    })
    let weaponsHeading = createHeadingRow(playerCount, "Weapons")
    table.appendChild(weaponsHeading)
    sheet.weapons.forEach(weapon => {
        let row = createRow(playerCount, [weapon], true)
        table.appendChild(row)
    })
    let rooms = createHeadingRow(playerCount, "Rooms")
    table.appendChild(rooms)
    sheet.rooms.forEach(room => {
        let row = createRow(playerCount, [room], true)
        table.appendChild(row)
    })
    if (!mobile) {
        table.addEventListener("mouseleave", onMouseLeaveTable)
    }
}

function createHeadingRow(playerCount, heading) {
    let row = document.createElement("tr")
    let col = document.createElement("th")
    col.colSpan = (playerCount + 1).toString()
    col.innerText = heading
    row.appendChild(col)
    return row
}

function createRow(playerCount, headings, emptyHighlightable=false, centered=false, editable=false) {
    let row = document.createElement("tr")
    let numCols = playerCount + 1
    let currCol = 0;
    cells.push(Array(playerCount + 1))
    for (let i = 0; i < numCols; i++) {
        let col = document.createElement("td")
        cells[currRow][currCol] = col
        col.dataset.row = currRow.toString()
        col.dataset.col = currCol.toString()
        currCol ++;
        if (headings.length > i) {
            if (editable) {
                let input = document.createElement("input")
                input.classList.add("bold")
                input.value = headings[i]
                col.appendChild(input)
            } else {
                col.innerText = headings[i]
            }
        } else if (emptyHighlightable) {
            col.classList.add("highlightable")
            if (mobile) {
                col.addEventListener("click", highlightInputRowAndCol)
            } else {
                col.addEventListener("mouseenter", highlightHoverRowAndCol)
            }
            let input = document.createElement("input")
            col.appendChild(input)
        }
        if (centered) {
            col.classList.add("centered-text")
        }
        row.appendChild(col)
    }
    currRow++;
    return row;
}

function highlightInputRowAndCol(event) {
    let target = event.target.parentNode

    if (target.tagName !== "TD") {
        return
    }
    highlightCellRowAndCol(target)
}

function highlightHoverRowAndCol(event) {
    highlightCellRowAndCol(event.target)
}

function highlightCellRowAndCol(cell) {
    let target = cell
    if (target !== currentHighlightedCell) {
        target.classList.add("highlighted")
        if (currentHighlightedCell != null) {
            currentHighlightedCell.classList.remove("highlighted")
            currentHighlightedCell.getElementsByTagName("input")[0].blur()
        }
    }
    currentHighlightedCell = target
    let row = parseInt(target.dataset.row)
    let col = parseInt(target.dataset.col)
    console.log(target)
    console.log(`Row: ${row}, Col: ${col}`)
    let player = findCell(0, col)
    let name = findCell(row, 0)
    if (player !== currentHighlightPlayer) {
        player.classList.add("highlighted")
        if (currentHighlightPlayer != null) {
            currentHighlightPlayer.classList.remove("highlighted")
        }
    }
    if (name !== currentHighlightName) {
        name.classList.add("highlighted")
        if (currentHighlightName != null) {
            currentHighlightName.classList.remove("highlighted")
        }
    }
    currentHighlightPlayer = player
    currentHighlightName = name
}

function onMouseLeaveTable(event) {
    if (currentHighlightName != null) {
        currentHighlightName.classList.remove("highlighted")
    }
    if (currentHighlightPlayer != null) {
        currentHighlightPlayer.classList.remove("highlighted")
    }
    if (currentHighlightedCell != null) {
        currentHighlightedCell.classList.remove("highlighted")
        currentHighlightedCell.getElementsByTagName("input")[0].blur()
    }
}

function findCell(row, col) {
    return cells[row][col]
}



function setup() {
    mobile = screen.width < 1200
    setupTable(PlayerCount)

}


window.onload = setup