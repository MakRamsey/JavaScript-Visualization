// Creating the map object
let map = L.map("map", {
    center: [37.09024,  -95.712891],
    zoom: 5
});
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Link to USGS Earthquake JSON payload
let earthquakePayload = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Define funciton to assign a string color value to each depth range
// Utilized Xpert assistance for color code mapping
function depthColor(depth) {
    if (depth < 10) {
        return '#c2f0c2';
    } else if (depth < 20) {
        return '#a2f0a2';
    } else if (depth < 30) {
        return '#80e080';
    } else if (depth < 40) {
        return '#e0e080';
    } else if (depth < 50) {
        return '#f0cba0';
    }  else if (depth < 60) {
        return '#f0a040';
    } else if (depth < 80) {
        return '#f06f6f';
    } else if (depth < 90) {
        return '#e04d4d';
    } else if (depth < 100) {
        return '#b02a2a';
    } else {
        return '#700000';
    }
}

//------------------------------------------------------------------------------------------------------------------------------------
// OPTION 1: ForEach loop pulling relevant data and plotting eathquake points one-by-one
//------------------------------------------------------------------------------------------------------------------------------------

// // Use d3 to retreive Earthquake payload
// d3.json(earthquakePayload).then((data) => {

//     // Retrieve Earthquake data from JSON payload
//     earthquakeData = data.features;

//     // Parse appropriately within a for loop
//     earthquakeData.forEach((earthquake) => {
//         let magnitude = earthquake.properties.mag;
//         let depth = earthquake.geometry.coordinates[2];
//         let place = earthquake.properties.place;
//         let title = earthquake.properties.title;
            
//         // Create circle markers for each earthquake and bind popups with required infomration
//         // Be sure to include marker size and depth considerations
//         L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
//             radius: (magnitude * 5),
//             fillColor: depthColor(depth),
//             color: 'white',
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         }).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth}<br>Place: ${place}<br>Title: ${title}`).addTo(map);
//     });
// });

//------------------------------------------------------------------------------------------------------------------------------------
// OPTION 2: Utilizing L.geoJSON to pull relevant data and generating a Leaflet Layer from GeoJSON points to plot earthquake locations
//------------------------------------------------------------------------------------------------------------------------------------

// Use d3 to retreive Earthquake payload
d3.json(earthquakePayload).then((data) => {

    // Utilize L.geoJSON method with pointToLayer function to pull unique values and return a layer of circle markers for each earthquake location
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            let location = feature.properties.place;
            let title = feature.properties.title;

            // Returning a cirlce marker layer for each geoJSON piece of data (latitude and longitude) within the dataset and subsequently binding desired popup information to display
            // Also adding to map
            return L.circleMarker(latlng, {
                radius: magnitude * 5,
                fillColor: depthColor(depth),
                color: 'white',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth}<br>Location: ${location}<br>Title: ${title}`);
        }
    }).addTo(map);
});


// Legend creation (*Remember to mirror creation on CSS file!)
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depthRanges = [0, 10, 20, 30, 40, 50, 60, 80, 90, 100];

    // Adding a title
    div.innerHTML += "<h4>Earthquake Depth Legend</h4>";

    // Loop through all depth ranges and add a color box for each range (Xpert Assistance)
    for (let i = 0; i < depthRanges.length; i++) {
        div.innerHTML += '<i style="background:' + depthColor(depthRanges[i]) + '"></i> ' +
            depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
    }

    return div;
};

// Adding the legend to the map
legend.addTo(map);