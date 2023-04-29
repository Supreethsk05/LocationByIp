document.addEventListener("DOMContentLoaded", () => {
  const locateButton = document.getElementById("locate-button");
  const ipAddress1Input = document.getElementById("ip-address-1");
  const ipAddress2Input = document.getElementById("ip-address-2");
  const locationResult1 = document.getElementById("location-result-1");
  const locationResult2 = document.getElementById("location-result-2");
  const mapContainer = document.getElementById("map");

  const apiKey = ""; //api key

  let map;
  let marker1;
  let marker2;

  function initMap(latitude, longitude) {
    const center = [latitude, longitude];

    map = L.map(mapContainer).setView(center, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18
    }).addTo(map);

    marker1 = L.marker(center).addTo(map);
  }

  locateButton.addEventListener("click", () => {
    const ipAddress1 = ipAddress1Input.value.trim();
    const ipAddress2 = ipAddress2Input.value.trim();
    if (!ipAddress1 || !ipAddress2) {
      alert("Please enter two IP addresses");
      return;
    }

    Promise.all([
      fetch(`https://api.ipdata.co/${ipAddress1}?api-key=${apiKey}`),
      fetch(`https://api.ipdata.co/${ipAddress2}?api-key=${apiKey}`)
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        const latitude1 = data[0].latitude;
        const longitude1 = data[0].longitude;
        const city1 = data[0].city;
        const region1 = data[0].region;
        const country1 = data[0].country_name;

        const latitude2 = data[1].latitude;
        const longitude2 = data[1].longitude;
        const city2 = data[1].city;
        const region2 = data[1].region;
        const country2 = data[1].country_name;

        locationResult1.innerText = `${city1}, ${region1}, ${country1}`;
        locationResult2.innerText = `${city2}, ${region2}, ${country2}`;

        if (!map) {
          initMap(latitude1, longitude1);
        } else {
          map.setView([latitude1, longitude1], 5);
          marker1.setLatLng([latitude1, longitude1]);
        }

        if (!marker2) {
          marker2 = L.marker([latitude2, longitude2]).addTo(map);
        } else {
          marker2.setLatLng([latitude2, longitude2]);
        }
      })
      .catch(error => {
        locationResult1.innerText = "Error fetching location data";
        locationResult2.innerText = "Error fetching location data";
        console.error(`Error fetching location data: ${error}`);
      });
  });
});
