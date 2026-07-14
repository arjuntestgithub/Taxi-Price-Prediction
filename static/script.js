
// // Initialize the map
        
// function initMap() {
//     const mapDiv = document.getElementById("map");
//     const map = new google.maps.Map(mapDiv, {
//         center: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
//         zoom: 12 // Adjust zoom level as needed
//     });

//     // Initialize draggable markers for pickup and dropoff locations
//     const pickupMarker = new google.maps.Marker({
//         position: { lat: 40.7128, lng: -74.0060 }, // Default pickup location (New York City)
//         map: map,
//         draggable: true,
//         title: 'Pickup Location'
//     });

//     const dropoffMarker = new google.maps.Marker({
//         position: { lat: 40.7128, lng: -74.0060 }, // Default dropoff location (New York City)
//         map: map,
//         draggable: true,
//         title: 'Dropoff Location'
//     });

//     // Event listener for when the pickup marker is dragged
//     pickupMarker.addListener('dragend', function(event) {
//         document.getElementById('pickup_latitude').value = event.latLng.lat();
//         document.getElementById('pickup_longitude').value = event.latLng.lng();
//     });

//     // Event listener for when the dropoff marker is dragged
//     dropoffMarker.addListener('dragend', function(event) {
//         document.getElementById('dropoff_latitude').value = event.latLng.lat();
//         document.getElementById('dropoff_longitude').value = event.latLng.lng();
//     });
// }

// // Load the Google Maps API script
// function loadMapScript() {
//     const script = document.createElement("script");
//     script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyApb69fNQll1kFrfUP-xTIrrOC6xz2MDxA&callback=initMap";
//     script.defer = true;
//     script.async = true;
//     document.head.appendChild(script);
// }

// // Call the function to load the Google Maps API
// loadMapScript();





// Initialize OpenStreetMap using Leaflet



// Initialize the map centered on New York City (no markers yet)
const map = L.map('map').setView([40.7128, -74.0060], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

setTimeout(() => {
    map.invalidateSize();
}, 100);

// Markers start as null — they'll be created only when valid input is given
let pickupMarker = null;
let dropoffMarker = null;

// Get form input references
const pickupLatInput = document.getElementById('pickup_latitude');
const pickupLngInput = document.getElementById('pickup_longitude');
const dropoffLatInput = document.getElementById('dropoff_latitude');
const dropoffLngInput = document.getElementById('dropoff_longitude');

// ---------- Show/update pickup marker when user fills lat & long ----------
function updatePickupFromInput() {
    const lat = parseFloat(pickupLatInput.value);
    const lng = parseFloat(pickupLngInput.value);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        if (pickupMarker) {
            // Marker already exists — just move it
            pickupMarker.setLatLng([lat, lng]);
        } else {
            // Create marker for the first time
            pickupMarker = L.marker([lat, lng], {
                draggable: true,
                title: 'Pickup Location'
            }).addTo(map).bindPopup('Pickup Location').openPopup();

            // Allow dragging to also update the input fields
            pickupMarker.on('dragend', function(event) {
                const pos = event.target.getLatLng();
                pickupLatInput.value = pos.lat.toFixed(6);
                pickupLngInput.value = pos.lng.toFixed(6);
            });
        }
        map.panTo([lat, lng]);
    }
}

// ---------- Show/update dropoff marker when user fills lat & long ----------
function updateDropoffFromInput() {
    const lat = parseFloat(dropoffLatInput.value);
    const lng = parseFloat(dropoffLngInput.value);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        if (dropoffMarker) {
            dropoffMarker.setLatLng([lat, lng]);
        } else {
            dropoffMarker = L.marker([lat, lng], {
                draggable: true,
                title: 'Dropoff Location'
            }).addTo(map).bindPopup('Dropoff Location').openPopup();

            dropoffMarker.on('dragend', function(event) {
                const pos = event.target.getLatLng();
                dropoffLatInput.value = pos.lat.toFixed(6);
                dropoffLngInput.value = pos.lng.toFixed(6);
            });
        }
        map.panTo([lat, lng]);
    }
}

// Trigger as soon as user finishes typing in either lat or long field
pickupLatInput.addEventListener('input', updatePickupFromInput);
pickupLngInput.addEventListener('input', updatePickupFromInput);
dropoffLatInput.addEventListener('input', updateDropoffFromInput);
dropoffLngInput.addEventListener('input', updateDropoffFromInput);


document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    // Timezone offset adjust karke local datetime string banate hain
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const formattedDateTime = now.toISOString().slice(0, 16);
    document.getElementById('pickup_datetime').value = formattedDateTime;
});