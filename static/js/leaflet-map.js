function initMap() {
    var latLong = [-38.81218, 145.249786];

    var map = L.map("map").setView(latLong, 5);

    L.tileLayer("https://b.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18,
    }).addTo(map);

    var icon = L.icon({
      iconUrl: "images/map-marker.png",
      iconSize:     [25, 41],
    });
    var marker = L.marker(latLong, { icon: icon }).addTo(map);
}
document.addEventListener("DOMContentLoaded", initMap);
