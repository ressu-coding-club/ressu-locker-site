import * as Sections from "./section-data.js"

const left_section_nav = document.getElementById('section-left');
const right_section_nav = document.getElementById('section-right');

const section_info_txt = document.getElementById('section-info-text');

function _updateNavigationBtns() {
    if(currentSection===0) return left_section_nav.ariaDisabled="true";
    if(currentSection===Sections.section_data.length-1) return right_section_nav.ariaDisabled="true";

    left_section_nav.ariaDisabled="false";
    right_section_nav.ariaDisabled="false";
}

function _updateSectionInfoText()
{
    section_info_txt.innerText = `Floor:${Sections.section_data.at(currentSection).floor}, Range:${Sections.section_data.at(currentSection).start}-${Sections.section_data.at(currentSection).end}`;
}

/**
 * @param {(sectionId: number) => void} displayUpdateFunction 
 */
function Update(displayUpdateFunction)
{
    displayUpdateFunction(currentSection);
    _updateNavigationBtns()
    _updateSectionInfoText()
}

export let currentSection = 0;
/**
 * Adds a section navigation observer.
 * @param {(sectionId: number) => void} displayUpdateFunction 
 */
export function NavigationObserver(displayUpdateFunction)
{
    Update(displayUpdateFunction)

    left_section_nav.addEventListener('click', function(){
        currentSection = Math.max(currentSection-1, 0);
        Update(displayUpdateFunction)
    })

    right_section_nav.addEventListener('click', function(){
        currentSection = Math.min(currentSection+1, Sections.section_data.length-1);
        Update(displayUpdateFunction)
    })
}