import {useCallback, useEffect, useRef, useState} from 'react';

import Places from './components/Places.jsx';
import {AVAILABLE_PLACES} from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import {sortPlacesByDistance} from "./loc.js";

let storageIds = JSON.parse(localStorage.getItem('selectedPlace')) || []
let storedPlaces = storageIds.map((id) =>
    AVAILABLE_PLACES.find((place) => place.id === id)
)

function App() {
    const modal = useRef();
    const selectedPlace = useRef();
    const [modelIsOpen, setModelIsOpen] = useState(false)
    const [availablePlaces, setAvailablePlaces] = useState([])
    const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const sortedPlaces = sortPlacesByDistance(
                    AVAILABLE_PLACES,
                    position.coords.latitude,
                    position.coords.longitude
                )
                setAvailablePlaces(sortedPlaces)
            },
        );
    }, []);


    function handleStartRemovePlace(id) {
        setModelIsOpen(true)
        selectedPlace.current = id;
    }

    function handleStopRemovePlace() {
        setModelIsOpen(false)
    }

    function handleSelectPlace(id) {
        setPickedPlaces((prevPickedPlaces) => {
            if (prevPickedPlaces.some((place) => place.id === id)) {
                return prevPickedPlaces;
            }
            const place = AVAILABLE_PLACES.find((place) => place.id === id);
            return [place, ...prevPickedPlaces];
        });
        let storageIds = JSON.parse(localStorage.getItem('selectedPlace')) || []
        if (storageIds.indexOf(id) === -1) {
            localStorage.setItem('selectedPlace', JSON.stringify([id, ...storageIds]));
        }
    }

   const handleRemovePlace = useCallback(function handleRemovePlace() {
            setPickedPlaces((prevPickedPlaces) =>
                prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
            );
            setModelIsOpen(false)
            let storageIds = JSON.parse(localStorage.getItem('selectedPlace')) || []
            localStorage.setItem('selectedPlace', JSON.stringify(storageIds.filter((id) => id !== selectedPlace.current))
            )
        },[]
    )

    return (
        <>
            <Modal open={modelIsOpen}>
                <DeleteConfirmation
                    onCancel={handleStopRemovePlace}
                    onConfirm={handleRemovePlace}
                />
            </Modal>

            <header>
                <img src={logoImg} alt="Stylized globe"/>
                <h1>PlacePicker</h1>
                <p>
                    Create your personal collection of places you would like to visit or
                    you have visited.
                </p>
            </header>
            <main>
                <Places
                    title="I'd like to visit ..."
                    fallbackText={'Select the places you would like to visit below.'}
                    places={pickedPlaces}
                    onSelectPlace={handleStartRemovePlace}
                />
                <Places
                    title="Available Places"
                    places={AVAILABLE_PLACES}
                    fallbackText='Sorting places by distance...'
                    onSelectPlace={handleSelectPlace}
                />
            </main>
        </>
    );
}

export default App;
