// This script demonstrates some simple things one can do with leaflet.js

var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

var WaterColorTiles = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);

// add our geojson to the map using jQuery to open and L.geoJson to add to map
// remember that var neighborhoods, subwayLines and pawnShops were
// set in the their .geojson files

// add neighborhoods
//L.geoJson(neighborhoods).addTo(map);
// add subway lines
//L.geoJson(subwayLines).addTo(map);
// add warming shelters
//L.geoJson(daytimeWarmingShelter).addTo(map);

// now let's add popups and styling 

// subway lines

var subwayStyle = {
	"color": "#78D347",
    "weight": 2,
    "opacity": .8
};

var subwayClick = function (feature, layer) {
	// let's bind some feature properties to a pop up
	layer.bindPopup(feature.properties.Line);
}

var subwayLinesGeoJSON = L.geoJson(subwayLines, {
    style: subwayStyle,
    onEachFeature: subwayClick
}).addTo(map);


// warming shelter dots
// feature and lat/long references

var warmingShelterPoint = function (feature, latlng){
	var shelterMarker = L.circle(latlng, 100, {
		stroke: false,
		fillColor: '#D53858',
		fillOpacity: 1
	});
	
	return shelterMarker;	
}

var warmingShelterClick = function (feature, layer) {
	// let's bind some feature properties to a pop up

	layer.bindPopup("<strong>Warming Shelter</strong> " + feature.properties.Borough);
}

var warmingShelterGeoJSON = L.geoJson(daytimeWarmingShelter, {
	pointToLayer: warmingShelterPoint,
	onEachFeature: warmingShelterClick
}).addTo(map);


// neighborhood choropleth map
// let's use % in poverty to color the neighborhood map

var povertyStyle = function (feature){
    var value = feature.properties.UnempRate;
    var fillColor = null;
    if(value >= 0 && value <=0.02){
		fillColor = "#f7fcfd";
    }
    if(value >0.02 && value <=0.04){
        fillColor = "#e0ecf4";
    }
    if(value >0.040 && value<=0.06){
    	fillColor = "#bfd3e6";
    }
    if(value >0.06 && value <=0.08){
    	fillColor = "#9ebcda";
    }
    if(value >0.08 && value <=.1) { 
		fillColor = "#8c96c6";
    }
     if(value >0.1 && value <=.12) { 
        fillColor = "#8c6bb1";
    }
     if(value >0.12 && value <=.14) { 
        fillColor = "#88419d";
    }
     if(value >0.14) { 
        fillColor = "#6e016b";
    }

    var style = {
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.75,
        fillColor: fillColor
    }

    return style;
}

var povertyClick = function (feature, layer) {
	var percent = feature.properties.UnempRate * 100;
    percent = percent.toFixed(0);
	// let's bind some feature properties to a pop up
	layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Unemployment Rate: </strong>" + percent + "%");
}

var neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
    style: povertyStyle,
    onEachFeature: povertyClick
}).addTo(map);


// add in layer controls

var baseMaps = {
    "CartoDB": CartoDBTiles,
    "Water Colors": WaterColorTiles,
};

var overlayMaps = {
    "Daytime Warming Shelters": warmingShelterGeoJSON,
    "Subway Lines": subwayLinesGeoJSON,
    "Povery Map": neighborhoodsGeoJSON
};

// add control
L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(map);





