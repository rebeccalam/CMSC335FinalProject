class Suspect {

    constructor(item){
            
            this.file = item.files!=null ? item.files[0].url : "No File Found";
        
            if (item.weight != null) {
                this.weight = this.extractValue(item.weight);
            } else if (item.weight_max != null) {
                this.weight = this.extractValue(item.weight_max);
            } else if (item.weight_min != null) {
                this.weight = this.extractValue(item.weight_min);
            } else {
                this.weight = "Unknown";
            }
            
            if ((item.sex != null) && (this.weight === "Unknown" || this.weight === null)) {
                if (item.sex.trim().toLowerCase() === 'male') {
                    this.weight = Math.floor(Math.random() * (236 - 168) + 168);
                } else {
                    this.weight = Math.floor(Math.random() * (195 - 130) + 130);
                }
            }
        
            if (item.height_max != null) {
                this.height = this.extractValue(item.height_max);
            } else if (item.height_min != null) {
                this.height = this.extractValue(item.height_min);
            } else {
                this.height = "Unknown";
            }
            
            if ((item.sex != null) && (this.height === "Unknown" || this.height === null)) {
                if (item.sex.trim().toLowerCase() === 'male') {
                    this.height = Math.floor(Math.random() * (75 - 63) + 63);
                } else {
                    this.height = Math.floor(Math.random() * (68 - 60) + 60);
                }
            }
        
            if(item.hair != null){
                this.hair = this.capitalize(item.hair);
            } else {
                this.hair = "Unknown";
            }
        
            if (item.age_max != null) {
                this.age = this.extractValue(item.age_max);
            } else if (item.age_min != null) {
                this.age = this.extractValue(item.age_min);
            } else if (item.age_range != null) {
                this.age = this.extractValue(item.age_range);
            } else if (item.dates_of_birth_used!=null && item.dates_of_birth_used.length > 0) {
                const match = item.dates_of_birth_used[0].match(/\d{4}/);
                if (match) {
                    this.age = 2024 - parseInt(match[0], 10);; 
                } else {
                    this.age = "Unknown";  
                }
            } else {
                this.age = "Unknown";
            }
        
            if(item.race != null){
                this.race = this.capitalize(item.race);
            } else {
                this.race = "Unknown";
            }
        
            if(item.publication != null){
                const timeStamp = new Date(item.publication);
                this.date_published = timeStamp.toLocaleDateString()
            } else {
                const today = new Date();
                this.date_published = today.toLocaleDateString();
            }
        
            this.image = item.images!=null ? item.images[0].large : "No File Found";
        
                this.occupations = item.occupations!=null ? item.occupations : "Unknown";
                this.locations = item.locations!=null ? item.locations : "Unknown";
                this.sex = item.sex!=null ? this.capitalize(item.sex) : "Unknown";
                this.dates_of_birth = item.dates_of_birth_used!=null ? item.dates_of_birth_used : "Unknown";
                this.caution = item.caution!=null ? item.caution : "Unknown";
                this.nationality = item.nationality!=null ? this.capitalize(item.nationality) : "Unknown";
                this.scars_and_marks = item.scars_and_marks!=null ? item.scars_and_marks : "Unknown";
                this.aliases = item.aliases!=null ? item.aliases : "Unknown";
                this.name = item.title!=null ? item.title.split(" - ")[0] : "Unknown";
                this.languages = item.languages!=null ? item.languages : "Unknown";
                this.description = item.description!=null ? item.description : "Unknown";
                this.place_of_birth = item.place_of_birth!=null ? item.place_of_birth : "Unknown";
                this.warning_message = item.warning_message!=null ? item.warning_message : "Unknown";
                this.details = item.details!=null ? item.details : "Unknown";
                this.reward = item.reward_text!=null ? item.reward_text : "Unknown";
        }

    toString() {
        return `Suspect Details:
        Name: ${this.name}
        Sex: ${this.sex}
        Age: ${this.age}
        Nationality: ${this.nationality}
        Hair: ${this.hair}
        Weight: ${this.weight}
        Height: ${this.height}
        Race: ${this.race}
        Scars and Marks: ${this.scars_and_marks}
        Description: ${this.description}
        Warning Message: ${this.warning_message}
        Reward: ${this.reward}`;
    }

    checkSuspectMatch(sex, hair, minHeight, maxHeight, race, minWeight, maxWeight, minAge, maxAge) {
        const sexMatch = (this.sex.toLowerCase() === sex?.toLowerCase());
        const hairMatch = (this.hair === "Unknown" || this.hair.toLowerCase() === hair?.toLowerCase());
        const raceMatch = (this.race.toLowerCase() === race?.toLowerCase());
        const heightMatch = (this.height === "Unknown" || (this.height >= minHeight && this.height <= maxHeight));
        const weightMatch = (this.weight === "Unknown" || (this.weight >= minWeight && this.weight <= maxWeight));
        const ageMatch = (this.age === "Unknown" || (this.age >= minAge && this.age <= maxAge));
        const isVictim = (this.description.toLowerCase().includes("victim")); 
    
        return sexMatch && hairMatch && raceMatch && heightMatch && weightMatch && ageMatch && !isVictim;
    }

    extractValue(value) {
        const match = String(value).match(/\d+/);
        return match ? parseInt(match[0], 10) : "Unknown";
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


}

export default Suspect;