import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '35226644-fa012e2a2ab77872d84abde88';

  page = 1;
    query = null;
    count = 40;

    async fetchPhotos() {
        try {
          return await axios.get(`${this.#BASE_URL}`, {
        params: {
            query: this.query,
            page: this.page,
            key: this.#API_KEY,
            q: this.query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: this.count,
       
      },
    });
        } catch (error) {
            throw new Error(error.message);
      }
    
  }
}
