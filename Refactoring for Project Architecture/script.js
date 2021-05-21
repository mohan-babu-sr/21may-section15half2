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

class App{
    #map;
    #mapEvent;

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
        
                //Clear input fields
                inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value='';
                // To Display Marker
                    // console.log(this.#mapEvent);
                    const {lat,lng}=this.#mapEvent.latlng;
        
                    L.marker([lat,lng])
                    .addTo(this.#map)
                    .bindPopup(
                        L.popup({
                        maxWidth:250,
                        minWidth:100,
                        autoClose:false,
                        closeOnClick:false,
                        className:'running-popup',           
                    })
                    )
                    .setPopupContent('get started')
                    .openPopup();
    }
}

const app =new App(); 

