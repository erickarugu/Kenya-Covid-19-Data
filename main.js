'use strict'
// Set the map variable
const myMap = L.map('map');

// Load the basemap
const myBasemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Add basemap to map id
myBasemap.addTo(myMap);

// Set view of the map
myMap.setView([-0.7077015,37.6971872],7);


var req = new XMLHttpRequest();
req.open('GET', 'covid.json', true);
req.responseType = 'text';

req.onload = () => {
    var data = JSON.parse(req.responseText);
    console.log(data);

    var counties = data.counties.map((county) => {
        L.marker([county.lat, county.long])
        .bindPopup(
            `
            <h2>${county.county} Stats</h2>
            <hr>
            <p><b>Today Cases: </b> ${county.today}</p>
            <p><b>Total Cases: </b> ${county.total}</p>
            <p><b>Total Deaths: :</b> ${county.deaths}</p>
            <p><b>Critical: </b> ${county.critical}</p>
            `
          )
          .openPopup()
          .addTo(myMap);

          L.circle([county.lat, county.long], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: `${county.total * 200}`
        }).addTo(myMap);
    });

    var sortedCounties = data.counties.sort((a,b) => {
        var x = a.total, y = b.total;
        return x < y ? 1 : x > y ? -1 : 0;
    })
    var sidebar = document.getElementById('cases');
    var countyNames = sortedCounties.map((county,i) => {
        var p = document.createElement('p');

        p.innerHTML = 
        `<b>${i+1}. ${county.county}</b> : 
        ${county.total}
        `
        sidebar.appendChild(p);
    })
};
req.send();
