// Haversine formula to calculate distance between two coordinates in km
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100;
};

// Get nearby showrooms within specified radius
export const getNearbyShowrooms = (userLat, userLng, showrooms, radiusKm = 10) => {
  return showrooms
    .map(showroom => ({
      ...showroom.toObject(),
      distance: calculateDistance(
        userLat,
        userLng,
        showroom.location.coordinates[1],
        showroom.location.coordinates[0]
      )
    }))
    .filter(showroom => showroom.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};
