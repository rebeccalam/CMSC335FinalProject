//MUST BE FIXED
import  {fs, path, express, Suspect} from './shared.js';

const apiUrl = 'https://api.fbi.gov/wanted/v1/list';
let allItems = [];
let suspectList = [];

export async function fetchAllPages() {
    let totalPages = 52;

    try {
        for (let i = 10; i <= totalPages; i++) {
            const response = await fetch(`${apiUrl}?page=${i}`);

            if (!response.ok) {
                console.error(`Error fetching page ${i}:`, response.status, response.statusText);
                continue; 
            }

            const data = await response.json();
            allItems = allItems.concat(data.items);
        }
        console.log("Fetched!");
        
        allItems.forEach(item => {
            console.log(item.title);
            const suspect = new Suspect(item);
            suspectList.push(suspect);
        });

        const outputFile = 'suspectsDetails.txt';

        fs.writeFileSync(outputFile, '');  

        suspectList.forEach(suspect => {
            const suspectDetails = `
        --- Suspect Details ---
        File: ${suspect.file}
        Weight: ${suspect.weight}
        Occupations: ${suspect.occupations}
        Locations: ${suspect.locations}
        Sex: ${suspect.sex}
        Hair: ${suspect.hair}
        Dates of Birth: ${suspect.dates_of_birth}
        Caution: ${suspect.caution}
        Nationality: ${suspect.nationality}
        Age: ${suspect.age}
        Scars and Marks: ${suspect.scars_and_marks}
        Aliases: ${suspect.aliases}
        Race: ${suspect.race}
        Name: ${suspect.name}
        Date Published: ${suspect.date_published}
        Languages: ${suspect.languages}
        Description: ${suspect.description}
        Image: ${suspect.image}
        Place of Birth: ${suspect.place_of_birth}
        Warning Message: ${suspect.warning_message}
        Details: ${suspect.details}
        Reward: ${suspect.reward}
        Height: ${suspect.height}
        ------------------------
        `;
        fs.appendFileSync(outputFile, suspectDetails + '\n\n'); 
    });
        
    } catch (error) {
        console.error('Error fetching FBI wanted data:', error);
    }

    return suspectList;
}

