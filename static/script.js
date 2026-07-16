

const map = L.map('map').setView([28.6139, 77.2090], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let pickupMarker = null;
let dropMarker = null;
let routeLine = null;
// Get latitude longitude from location name
async function getCoordinates(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    const response = await fetch(url, {
        headers: {
            "User-Agent": "PoolCab-App"
        }
    });
    const data = await response.json();
    if(data.length > 0){
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        };
    }
    return null;
}
// Add marker on map
function addMarker(position, type){
    let marker;
    if(type === "pickup"){
        if(pickupMarker){
            pickupMarker.setLatLng(position);
        }
        else{
            pickupMarker = L.marker(position)
                .addTo(map)
                .bindPopup("Pickup Location");
        }
        marker = pickupMarker;
    }
    if(type === "drop"){
        if(dropMarker){
            dropMarker.setLatLng(position);
        }
        else{
            dropMarker = L.marker(position)
                .addTo(map)
                .bindPopup("Drop Location");
        }
        marker = dropMarker;
    }
    marker.openPopup();
    map.setView(position, 13);
}
// Pickup input
document.getElementById("pickup")
.addEventListener("change", async function(){
    const location = this.value;
    const coordinates = await getCoordinates(location);
    if(coordinates){
        addMarker(
            [coordinates.lat, coordinates.lng],
            "pickup"
        );
        drawRoute();
    }
    else{
        alert("Pickup location not found");
    }
});
// Drop input
document.getElementById("drop")
.addEventListener("change", async function(){
    const location = this.value;
    const coordinates = await getCoordinates(location);
    if(coordinates){
        addMarker(
            [coordinates.lat, coordinates.lng],
            "drop"
        );
        drawRoute();
    }
    else{
        alert("Drop location not found");
    }
});
// Draw line between pickup and drop
function drawRoute(){
    if(pickupMarker && dropMarker){
        let pickup = pickupMarker.getLatLng();
        let drop = dropMarker.getLatLng();
        if(routeLine){
            map.removeLayer(routeLine);
        }
        routeLine = L.polyline(
            [
                [pickup.lat,pickup.lng],
                [drop.lat,drop.lng]
            ],
            {
                color:"blue"
            }
        ).addTo(map);
        map.fitBounds(routeLine.getBounds());
    }
}