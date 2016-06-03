window.onload = function() {
    var mymap = L.map('mapid').setView([8.11361508149333, -1.20849609375], 7);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'bnhn.06flgikf',
        accessToken: 'pk.eyJ1IjoiYm5obiIsImEiOiJjaW9lNGM2Y2IwMDB0dXdreGZsZjhic2dzIn0.rxuGQtRHIO4jt4lTg0jRTQ'
    }).addTo(mymap);
    L.control.scale().addTo(mymap);

    function getColor(d) {
        return d > 1000 ? '#7a0177' :
            d > 500 ? '#ae017e' :
            d > 200 ? '#dd3497' :
            d > 100 ? '#f768a1' :
            d > 50 ? '#fa9fb5' :
            d > 10 ? '#fcc5c0' :
            '#feebe2';
    }

    function districtStyle(feature) {
        return {
            fillColor: getColor(feature.properties.Pop_Densit),
            weight: 1,
            opacity: 1,
            color: 'black',
            dashArray: '',
            fillOpacity: 0.8
        };
    }

    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }

    function zoomOut(e) {
        mymap.setZoom(mymap.getMinZoom());
    }
    var districts = new L.geoJson(districtpopulation, {
        style: districtStyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<b>Region:</b> " + feature.properties.REGION + "<br>" +
                "<b>District:</b> " + feature.properties.DISTRICT + "<br>" +
                "<b>District Capital:</b> " + feature.properties.District_C + "<br>" +
                "<b>Population:</b> " + feature.properties.Pop_Total + "<br>" +
                "<b>Area (sq km)</b> :" + feature.properties.Area_sq_km);
            layer.on({
                //mouseover: highlightFeature,
                //mouseout: resetHighlight,
                click: zoomToFeature,
                dblclick: zoomOut
            });
        }
    }).addTo(mymap);
    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
};