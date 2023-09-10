import { Loader } from "./loader.js";
import { generate_random_image } from "./random_img_gen.js";

/**
 * Interlaces the informative text with the specified image.
 * 
 * @param {SVGSVGElement | HTMLImageElement | null} image 
 *  The image itself or null if the paragraph should not have any images.
 * @param {number} n_paragraphs 
 *  The number of paragraphs that the image will span. 
 * @param {0 | number} from_paragraph
 *  The starting paragraph from which to add the image.
 */
function addInformativeImage(image, n_paragraphs, from_paragraph)
{
    /**
     * @param {{'n_paragraphs':number,'from_paragraph':number}} data 
     */
    function format(data)
    {
        const informationContainer = document.createElement('div');
        informationContainer.className = `information-container`;

        const information = Loader['content'].match(/[^\r]/g).join('');
        
        if(image !== null) informationContainer.appendChild(image);

        const informationPart = informationContainer.appendChild(document.createElement('div'));
        informationPart.className = 'information-part';

        information.split('\n\n').slice(from_paragraph, from_paragraph+n_paragraphs).forEach(function(paragraph){
            informationPart.appendChild(document.createElement('p')).innerText = paragraph;
        });
        
        document.querySelector('.information').appendChild(informationContainer);
    }
    if(Loader.hasLoaded == false)
    {   
        Loader['callbackList'].push(format);
        Loader['callbackData'].push({'n_paragraphs':n_paragraphs, 'from_paragraph':from_paragraph});
    } else
    {
        format({'n_paragraphs':n_paragraphs, 'from_paragraph':from_paragraph});
    }
}


// create placeholder images for every 2 paragraphs
    Loader['callbackList'].push(
    function(){
        for(var i=0; i<Loader['n_paragraphs']; i+=2)
        {
            addInformativeImage(generate_random_image(100,100), 2, i);
        }
    });
    Loader['callbackData'].push(null);