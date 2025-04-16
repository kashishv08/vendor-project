const listingLocation = window.listingData?.location || "";
const encodedAddress = encodeURIComponent(listingLocation);

// console.log(L);
var map = L.map("map").setView([0, 0], 0);
L.tileLayer(
  "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=tSKJlHKAtqo6uosbaovl",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
).addTo(map);
// var marker = L.marker([51.5, -0.09]).addTo(map);

// Custom red icon for the marker
const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fetch coordinates based on location
fetch(
  `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json`
)
  .then((res) => res.json())
  .then((data) => {
    if (data.length === 0) throw new Error("No coordinates found");
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    map.setView([lat, lon], 10);

    // Add red marker with popup
    const customMarker = L.marker([lat, lon], { icon: redIcon })
      .addTo(map)
      .bindPopup(
        `  <div>
              <strong>${listingLocation}</strong><br/>
              <p>Exact location will be provided after booking.</p>
           </div>`
      ); // show only location

    customMarker.on("mouseover", function () {
      this.openPopup();
    });

    customMarker.on("mouseout", function () {
      this.closePopup();
    });

    // Add label beside marker
    showStateLabel(lat, lon, listingLocation);
  })
  .catch((err) => {
    console.error("Map error:", err);
    showStateLabel(0, 0, "Unknown location");
  });

function showStateLabel(lat, lon, labelText) {
  const stateLabel = L.divIcon({
    className: "state-label",
    html: `<strong>${labelText}</strong>`,
    iconSize: [100, 30],
    iconAnchor: [50, 15], // anchor on left edge
  });

  // Position label to the right of the marker
  L.marker([lat, lon + 0.0001], { icon: stateLabel }).addTo(map);
}
