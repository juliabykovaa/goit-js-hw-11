import { PixabayAPI } from './fetch-images';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const searchFormEl = document.querySelector('.search-form');
const inputEl = document.querySelector('[name="searchQuery"]')
const loadMoreBtnEl = document.querySelector('.js-load-more');
const submitButton = document.querySelector('[type="submit]')
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox(".gallery a", {});
const pixabayApi = new PixabayAPI();

const handleSearchFormSubmit = async event => {
    event.preventDefault();
    const searchQuery = inputEl.value;
    pixabayApi.query = searchQuery.trim();
    pixabayApi.page = 1;

    try {
        
      const { data } = await pixabayApi.fetchPhotos();
      gallery.innerHTML = renderImages(data.hits);
      lightbox.refresh();
      loadMoreBtnEl.classList.remove('is-hidden');
      inputEl.value = " ";

       if (!pixabayApi.query) {
          setTimeout(() => {
            Notiflix.Notify.failure('Sorry, your search query was empty.');
            }, 300);
          gallery.innerHTML = "";
          loadMoreBtnEl.classList.add('is-hidden');
        } else {
           setTimeout(() => {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }, 300);
       }
        if (!data.hits.length) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtnEl.classList.add('is-hidden');
       }
      
    } catch (err) {
      console.log(err);
      Notiflix.Notify.failure('Oops, something went wrong :(');
  }
};

function renderImages(images) {
  return images
    .map(({ webformatURL, largeImageURL, likes, views, comments, downloads, tags }) => {
      return `
        <div class="photo-card">
          <div class="thumb">
            <a class="image" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
          </div>
         <div class="info">
  <p class="info-item">
    <span class="stat-name"><b>Likes</b></span>
    <span class="line-break"></span>
    <span class="stat-data"><b>${likes}</b></span>
  </p>
  <p class="info-item">
    <span class="stat-name"><b>Views</b></span>
    <span class="line-break"></span>
    <span class="stat-data"><b>${views}</b></span>
  </p>
  <p class="info-item">
    <span class="stat-name"><b>Comments</b></span>
    <span class="line-break"></span>
    <span class="stat-data"><b>${comments}</b></span>
  </p>
  <p class="info-item">
    <span class="stat-name"><b>Downloads</b></span>
    <span class="line-break"></span>
    <span class="stat-data"><b>${downloads}</b></span>
  </p>
</div>
        </div>
      `;
    }).join("");
}

function endCollection() {
  loadMoreBtnEl.classList.add('is-hidden');
  Notiflix.Notify.info("Were sorry, but you've reached the end of search results");
}

const handleLoadMoreBtnClick = async () => {
    pixabayApi.page += 1;
    try {
        const { data } = await pixabayApi.fetchPhotos();
        gallery.insertAdjacentHTML('beforeend', renderImages(data.hits));
        lightbox.refresh();
        onScroll();
        const allPageElements = document.querySelectorAll('.photo-card');
        if (allPageElements.length === data.totalHits) {
        endCollection();
    };
    } catch (err) {
        console.log(err);
        Notiflix.Notify.failure('Oops, something went wrong :(');
    }
}

function onScroll() {
const { height: cardHeight } = gallery
  .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
