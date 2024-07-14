mapboxgl.accessToken = 'pk.eyJ1IjoibmVtaWxzaGFoIiwiYSI6ImNsd2Vva212MDE4djMyaWxkamx1emE2MG4ifQ.8i9uhpSxwWZo--UPI90rSA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: furniture.geometry.coordinates,
    zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(furniture.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${furniture.title}</h3><p>${furniture.location}</p>`)
    )
    .addTo(map);    