const SVG_URI = 'http://www.w3.org/2000/svg';

/** 
 * Generates a random integer in the `Range: [min,max)`
 * @type {(min:number,max:number) => number}
*/
const randint = (min, max) => Math.floor(Math.random() * (max - min)) + min; 

/**
 * Sets the attributes for the specified element.
 * 
 * @param {SVGSVGElement | Element} element
 * @param {object} attr_obj The object containing the attributes in a `[key:string,value:string]` pair.
 */
function set_attributes(element, attr_obj)
{
    for(const key in attr_obj)
    {
        element.setAttribute(key, attr_obj[key]);
    }
}

/**
 * Generates a random placeholder image. (SVG format)
 * @param {number} w The width of the image. 
 * @param {number} h The height of the image. 
 * 
 * @return {SVGSVGElement} The generated image.
 */
export function generate_random_image(w,h)
{

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    const options = {
        'circle': function(){
            const _circ = document.createElementNS(SVG_URI, 'circle');
            set_attributes(_circ, {
                'cx'            : `${w/2}`,
                'cy'            : `${w/2}`,
                'r'             : `${w/2 - 4}`,
                'stroke'        : `${colors[randint(0,colors.length)]}`,
                'fill'          : `${colors[randint(0,colors.length)]}`,
                'stroke-width'  : `8`
            });
            return _circ;
        }, 
        'square': function(){
            const _sqr = document.createElementNS(SVG_URI, 'rect');
            set_attributes(_sqr, {
                'width': `${w}`,
                'height': `${h}`,
                'stroke'        : `${colors[randint(0,colors.length)]}`,
                'fill'          : `${colors[randint(0,colors.length)]}`,
                'stroke-width'  : `8`
            });
            return _sqr;
        }, 
        'triangle':function(){
            const _tri = document.createElementNS(SVG_URI, 'polygon');
            set_attributes(_tri, {
                'points': `${4},${h-4} ${w/2},${4} ${w-4},${h-4}`,
                'stroke'        : `${colors[randint(0,colors.length)]}`,
                'fill'          : `${colors[randint(0,colors.length)]}`,
                'stroke-width'  : `8`
            });
            return _tri;
        }
    };

    const svg = document.createElementNS(SVG_URI, 'svg');
    set_attributes(svg, {
        'width' : `${w}px`,
        'height': `${h}px`
    });
    svg.appendChild(Object.values(options)[randint(0,Object.values(options).length)]());
    return svg;
}