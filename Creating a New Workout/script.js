'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout{
    date=new Date();
    id=(Date.now()+'').slice(-10);

    constructor(coords,distance,duration){
        this.coords=coords;
        this.distance=distance;//km
        this.duration=duration;//min
    }
}

class Running extends Workout{
    type='running';
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcPace();
    }

    calcPace(){
        this.pace=this.duration/this.distance;
        return this.pace;
    }
}

class Cyclying extends Workout{
    type='cycling'
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this.elevationGain=elevationGain;
        this.calcSpeed();
    }
    calcSpeed(){
        this.speed=this.distance/(this.duration/60);
        return this.speed;
    }
}

const run1=new Running([39,-12],5.2,24,178)
const cyc1=new Cyclying([39,-12],27,95,523)
console.log(run1,cyc1);

class App{
    #map;
    #mapEvent;
    #workouts=[];

    constructor(){
        this._getposition();

        form.addEventListener('submit',this._newWorkOut.bind(this));
        
        inputType.addEventListener('change',this._toggleElevationField);
    }
    _getposition(){
        // Using the Geolocation API
        if(navigator.geolocation){
            //inside function (successCallback,errorCallback)
                navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
                    
                    function(){
                        alert('Could not get your location');
                    });
        }
    }
    _loadMap(position){
            const {latitude}=position.coords; //destructuring - create variable latitude
            const {longitude}=position.coords;
            // console.log(latitude,longitude);
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`);



            const coords=[latitude,longitude];
            
            //Here we create a map in the 'map' div, add tiles of our choice, and then add a marker with some text in a popup  src(leaflet)
            //L is namespace for couple of method
            this.#map = L.map('map').setView(coords, 13);//zoom level of map by deafult


            //theme
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            

        //Handling click on map - leaflet map
        this.#map.on('click',this._showForm.bind(this));
    }
    _showForm(mapE){
        this.#mapEvent=mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }
    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkOut(e){
        e.preventDefault();
        const validInputs=(...inputs)=>inputs.every(inp=>Number.isFinite(inp)); 

        const allPositive=(...inputs)=>inputs.every(inp=>inp>0); 
        
        //form data
        const type=inputType.value;
        const distance=+inputDistance.value;
        const duration=+inputDuration.value;
        const {lat,lng}=this.#mapEvent.latlng;
        let workout;
        
        if(type==='running'){
            const cadence=+inputCadence.value;
            //using normal method
            // if(!Number.isFinite(distance)||!Number.isFinite(duration)||!Number.isFinite(cadence)) return alert('Type +ve numbers');

            //using arrow function
            if(!validInputs(distance,duration,cadence)||!allPositive(distance,duration,cadence))
                return alert('Type +ve numbers');

            workout=new Running([lat,lng],distance,duration,cadence);
        }
        
        if(type==='cycling'){
            const elevation=+inputCadence.value;
            if(!validInputs(distance,duration,elevation)||!allPositive(distance,duration))
                return alert('Type +ve numbers');
                workout=new Cyclying([lat,lng],distance,duration,elevation);
        }
        
        this.#workouts.push(workout);
        console.log(workout);
        // To Display Marker
        // console.log(this.#mapEvent);

        this.renderWorkoutMarker(workout)
        
        //Clear input fields
        inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value='';
    }


        renderWorkoutMarker(workout){
        L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(
            L.popup({
                maxWidth:250,
                minWidth:100,
                autoClose:false,
                closeOnClick:false,
                className:`${workout.type}-popup`,           
            })
            )
            .setPopupContent('workout')
            .openPopup();

        }
}
        
    const app =new App(); 