const api = "https://api.foursquare.com/v2/venues/search?client_id=VSF1QA2ZF4R1BGC4Q2A5UO3GX4BJUF3S0VOAYXBRBZI2RM4T&client_secret=YNE4JQWLBWCTMEYWNWPXZIGPITP5XQWZSFLNOJL1US0XAO2W&v=20130815&ll=";

export const get_info = marker => {
  const url =  api  + marker.getPosition().lat() + "," + marker.getPosition().lng();
  return fetch(url).then(response => {
    if (!response.ok) {
      throw response;
    } else return response.json();
  });
};
