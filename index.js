import  {path, express, Suspect, fetchAllPages, fetchAllPagesTest, fileURLToPath, dotenv, MongoClient, ServerApiVersion } from './shared.js';

const app = express();
let suspectList = [];

suspectList = await fetchAllPagesTest();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, 'credentials/.env') });

//fetchAllPages();

//you may need to edit the uri because mine was slightly different than caleb's
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.mcr1k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const databaseAndCollection = { db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION };

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const portNumber = 5001;
let crimeId = 0;


function generateID() {
    crimeId = Math.floor(1000 + Math.random() * 9000);
    return crimeId;

    
}
app.listen(portNumber, () => {
    process.stdout.write(`Web server started and running at http://localhost:${portNumber}\n`);
    
    const prompt = "Stop to shutdown the server: ";

    process.stdout.write(prompt);
    process.stdin.on("readable", function () {
        const dataInput = process.stdin.read();
        if (dataInput !== null) {
            const command = dataInput.toString().trim(); 
            
            if (command.toLowerCase() === "stop") {
                process.stdout.write("Shutting down the server\n");
                process.exit(0);
            } else {
                process.stdout.write(`Invalid Command: ${command}\n`);
            }
            process.stdout.write(prompt);
            process.stdin.resume();
        }
    });
});

app.get('/', (req, res) => {
    res.render('index');
});
app.get("/pastCrimeReports", (request, response) => {
    response.render("pastCrimeReports")}); 

app.post("/pastCrimeReports", (request, response) => {
    async function func() {
        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
        try {
            await client.connect();
            const result = await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .deleteMany({});
            response.render("pastCrimeReports")
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    func().catch(console.error);
 
}); 

app.post("/pastCrimeReportsList", (request, response) => {
    const {
        crimeId
    } = request.body;

    async function filterByID(id) {
        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
        let results = []; 
    
        try {
            await client.connect();
    
            const filter = { crimeId: Number(id) };
            const cursor = await client
                .db(databaseAndCollection.db)
                .collection(databaseAndCollection.collection)
                .find(filter);
            results = await cursor.toArray();
            let suspectCards;
            if (results.length != 0) {
            suspectCards = `<div class="suspectsContainer">`;
        
    
        results.forEach(suspect => {
            suspectCards += `
        <div id="resultsContainer">
            <h2>${suspect.name}</h2>
            <img src="${suspect.image}" alt="${suspect.name}" class="suspect-image" />
            <p><strong>DOB:</strong> ${suspect.dates_of_birth}</p> 
            <p><strong>Place of Birth:</strong> ${suspect.place_of_birth}</p>
            <p><strong>Age:</strong> ${suspect.age}</p>
            <p><strong>Warning Message:</strong> ${suspect.warning_message}</p>
            
            <p><strong>Physical Characteristics:</strong></p>
            <table class="suspect-table">
                <tr>
                    <td><strong>Sex:</strong></td>
                    <td>${suspect.sex}</td>
                </tr>
                <tr>
                    <td><strong>Hair:</strong></td>
                    <td>${suspect.hair}</td>
                </tr>
                <tr>
                    <td><strong>Height:</strong></td>
                    <td>${suspect.height}</td>
                </tr>
                <tr>
                    <td><strong>Race:</strong></td>
                    <td>${suspect.race}</td>
                </tr>
            </table>
            
            <p><strong>Description:</strong> ${suspect.description}</p>
            <p><strong> Click to view suspect's wanted poster: </strong> <a href="${suspect.file}">View Wanted Poster</a></p>
        </div>`;
        });
        suspectCards += '</div>';    
    } else {
        suspectCards = "<div class = 'noSuspects'> No Suspects Found</div><br><br>";
    }

        const variables ={
            crimeId: id,
            suspectCards: suspectCards,
        }
    
        response.render("pastCrimeReportsList", variables);

        
    
        } catch (e) {
            console.error("Error filtering IDs:", e);
        } finally {
            await client.close();
        }
        return results;
    }
    filterByID(crimeId);
    
}); 

app.get("/createNewList", (request, response) => {
    const variables ={
        sex:"",
        hair:"",
        nationality:"",
        race:"",

    }
    response.render("createNewList", variables)}); 

    app.get("/viewSuspectList", (request, response) => {
        const variables ={
    
            crimeId: crimeId,
            suspectCards: suspectCards
        
        }
        response.render("viewSuspectList", variables)}); 
    
    //POST createNewList submission
    app.post("/viewSuspectList", (request, response) => {
        let id = generateID();
  
        const {
            sex,
            hairColor,
            race,
            minAge,
            maxAge,
            minHeight,
            maxHeight,
            minW,
            maxW,

            additionalInfo,
        } = request.body;

        

        let matches = suspectList.filter(suspect => 
            suspect.checkSuspectMatch(sex, hairColor, minHeight, maxHeight, race, 40, 400, minAge, maxAge)
        );
        let suspectCards;
        if (matches.length != 0) {
        suspectCards = `<div class="suspectsContainer">`;

    

    matches.forEach(suspect => {
        suspectCards += `
    <div id="resultsContainer">
        <h2>${suspect.name}</h2>
        <img src="${suspect.image}" alt="${suspect.name}" class="suspect-image" />
        <p><strong>DOB:</strong> ${suspect.dates_of_birth}</p> 
        <p><strong>Place of Birth:</strong> ${suspect.place_of_birth}</p>
        <p><strong>Age:</strong> ${suspect.age}</p>
        <p><strong>Warning Message:</strong> ${suspect.warning_message}</p>
        
        <p><strong>Physical Characteristics:</strong></p>
        <table class="suspect-table">
            <tr>
                <td><strong>Sex:</strong></td>
                <td>${suspect.sex}</td>
            </tr>
            <tr>
                <td><strong>Hair:</strong></td>
                <td>${suspect.hair}</td>
            </tr>
            <tr>
                <td><strong>Height:</strong></td>
                <td>${suspect.height}</td>
            </tr>
            <tr>
                <td><strong>Race:</strong></td>
                <td>${suspect.race}</td>
            </tr>
        </table>
        
        <p><strong>Description:</strong> ${suspect.description}</p>
        <p><strong> Click to view suspect's wanted poster: </strong> <a href="${suspect.file}">View Wanted Poster</a></p>
    </div>`;
        let toInsert = {crimeId:id, name:suspect.name, image:suspect.image, dates_of_birth:suspect.dates_of_birth, place_of_birth:suspect.place_of_birth,
            warning_message:suspect.warning_message, sex:suspect.sex, hair:suspect.hair, height:suspect.height, age:suspect.age,
            race:suspect.race, description:suspect.description, file:suspect.file};

        insert(toInsert);
    });

    suspectCards += '</div>';    
}else{
    suspectCards = "<div class = 'noSuspects'> No Suspects Found</div><br><br>";
}
    const variables ={
        crimeId: crimeId,
        suspectCards: suspectCards,

    }

    response.render("viewSuspectList", variables);
}); 

async function insert(suspect) {
    const client = new MongoClient(uri, {serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(suspect);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


