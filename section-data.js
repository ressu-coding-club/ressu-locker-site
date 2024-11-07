export class SectionData
{
    /** The starting locker for this section */
    start=0;
    /** The ending locker for this section (inclusive). */
    end=0;
    /** The floor that this section is on. */
    floor=0;
    /** The width of the section (in lockers) */
    width=0;
    /** The height of the section (in lockers) */
    height=0;

    constructor(start, end, floor, width, height)
    {
        this.start = start;
        this.end = end;
        this.floor = floor;
        this.width = width;
        this.height = height;
    }

    /**
     * @returns {number} The number of lockers in this section.
     * @readonly.
     */
    get size() { return this.end - this.start + 1; }
}

/**
 * Returns the data of the section which on the specified floor and the first locker of the section is `section_start`.
 * @param {number} floor The floor this section is on. 
 * @param {number} section_start The starting locker of this section. 
 * @returns {SectionData}
 */
export function getSection(floor, section_start) {
    let sec = null;
    section_data.forEach(v => {
        if(v.floor == floor && v.start == section_start) return sec=v;
    })
    return sec;
}

/**
 * Creates a section.
 * @param {number} start The starting locker for this section
 * @param {number} end The ending locker for this section (inclusive).
 * @param {number} floor The floor that this section is on.
 * @param {number} width The width of the section (in lockers)
 * @param {number} height The height of the section (in lockers)
 * @returns {SectionData}
 */
export function createSection(start, end, floor, width, height)
{
    return new SectionData(start, end, floor, width, height)
}

/**
 * Converts the section index to the data of the section.
 * @param {number} index 
 */
export function getSectionViaIndex(index) {
    return section_data[index];
}

/** 
 * Contains data about the partition of each section i.e, the start and end number (inclusive) of each section
 * @type {SectionData[]}
*/
export const section_data =
[
    createSection(401,430,4,5,6),
    createSection(431,485,4,5,11),

    createSection(501,515,5,5,3),
    createSection(516,579,5,4,16),
    createSection(580,603,5,4,6),
    createSection(604,653,5,5,10),
    createSection(654,673,5,5,4),
    createSection(674,703,5,5,6),
    createSection(704,733,5,5,6)
]