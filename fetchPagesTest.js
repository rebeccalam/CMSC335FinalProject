import  {fs, path, Suspect} from './shared.js';
const folderPath = "./testJSONS";

export async function fetchAllPagesTest() {
    let suspectList = [];

    try {
        const files = await fs.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            try {
                const data = await fs.readFile(filePath, 'utf8');
                const jsonData = JSON.parse(data);

                if (jsonData.items) {
                    jsonData.items.forEach(item => {
                        //console.log(item.title);
                        const suspect = new Suspect(item);
                        suspectList.push(suspect);
                    });
                }
            } catch (err) {
                console.error(`Error reading or parsing file ${file}:`, err);
            }
        }

        const outputFile = 'testSuspectsDetails.txt';
        const fileContent = suspectList
            .map(suspect => `
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
                `).join('\n');

        await fs.writeFile(outputFile, fileContent);

    } catch (err) {
        console.error('Error reading folder:', err);
    }

    return suspectList;
}

