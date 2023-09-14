import { generate_random_image } from "./random_img_gen.js";


class ParagraphData
{
    /** @type {HTMLImageElement | SVGSVGElement | null} */
    image = null;
    /** @type {string[]} */
    paragraphs = [];

    constructor(image, paragraphs)
    {
        this.image = image;
        this.paragraphs = paragraphs;
    }
};

/** @type {ParagraphData[]} */
export const DataList = [];

/**
 * @param {HTMLImageElement | SVGSVGElement | null} image 
 * @param {string[]} paragraphs 
 */
function addData(image, paragraphs) 
{
    DataList.push(new ParagraphData(image, paragraphs));
}

function loadDataList()
{
    DataList.forEach(function(data){
        const informationContainer = document.createElement('div');
        informationContainer.className = `information-container`;

        if(data.image !== null) informationContainer.appendChild(data.image);

        const informationPart = informationContainer.appendChild(document.createElement('div'));
        informationPart.className = 'information-part';

        data.paragraphs.forEach(function(paragraph){
            informationPart.appendChild(document.createElement('p')).innerText = paragraph;
        })

        document.querySelector('.information').appendChild(informationContainer);
    })
}

addData(generate_random_image(100, 100), [`Rhonda prided herself on always taking the path less traveled. She'd decided to do this at an early age and had continued to do so throughout her entire life. It was a point of pride and she would explain to anyone who would listen that doing so was something that she'd made great efforts to always do. She'd never questioned this decision until her five-year-old niece asked her, "So, is this why your life has been so difficult?" and Rhonda didn't have an answer for her.`])
addData(generate_random_image(100,100), ["Why?"])
loadDataList();
