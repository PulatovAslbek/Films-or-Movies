const elForm = makeElament('.movies__form')
const elMoviesTemplate = makeElament('.movies_template').content;
const elModalInfo = makeElament('.modal');

const elInputSearch = makeElament('.form__input', elForm)
const elMoviesList = makeElament('.movies_list');
const elSelectGeners = makeElament('.form__select', elForm);
const elSelectSort = makeElament('.form__select-sort', elForm);

const elOverview = makeElament('.overview');
const elDate = makeElament('.release_date');
const elGenresList = makeElament('.genres_list');
const elCloseModalBtn = makeElament('.modal__close_btn');

function renderGenersSelect(films, element) {
    const result = [];

    films.forEach(film => {
        film.genres.forEach(genre => {
            if (!result.includes(genre)) {
                result.push(genre);
            }
        });
    });
    result.forEach(genre => {
        const newOp = createDOM('option');
        newOp.value = genre;
        newOp.textContent = genre;

        element.appendChild(newOp);

    });

}

function renderFilms(moviesArr, element) {
    element.innerHTML = null;

    moviesArr.forEach(film => {

        const filmTemplate = elMoviesTemplate.cloneNode(true);

        makeElament('.id', filmTemplate).textContent = film.id;
        makeElament('.movies_heading', filmTemplate).textContent = film.title;
        makeElament('.film_img', filmTemplate).setAttribute('src', film.poster);
        makeElament('.film_img', filmTemplate).setAttribute('alt', film.title);

        const elMoreBtn = makeElament('.movie_btn', filmTemplate);
        elMoreBtn.dataset.film_id = film.id;

        elCloseModalBtn.addEventListener('click', (evt) => {
            elModalInfo.classList.remove('modal_active');
        })

        elMoreBtn.addEventListener('click', (evt) => {
            elModalInfo.classList.add('modal_active');
            const filmId = evt.target.dataset.film_id;

            const foundFilm = moviesArr.find((item) => item.id === filmId);
            elOverview.textContent = foundFilm.overview;
            elDate.textContent = normalizedDate(foundFilm.release_date);

            elGenresList.innerHTML = null;
            foundFilm.genres.forEach(genre => {
                const newLi = createDOM('li');
                newLi.textContent = genre;

                elGenresList.appendChild(newLi);
            });
        });
        element.appendChild(filmTemplate);
    });
}

renderGenersSelect(films, elSelectGeners);
renderFilms(films, elMoviesList);

elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputSearchValue = elInputSearch.value.trim();
    const selectGenres = elSelectGeners.value.trim();
    const selectSorted = elSelectSort.value.trim();

    const regex = new RegExp(inputSearchValue, 'gi');
    const searchedFilms = films.filter(film => film.title.match(regex));


    let foundFilms = [];

    if (selectGenres === 'All') {
        foundFilms = searchedFilms;
    } else {
        foundFilms = searchedFilms.filter(film => film.genres.includes(selectGenres));
    }

    if(selectSorted === 'a_z'){
        foundFilms.sort((a, b) =>{
            if(a.title > b.title){
                return 1
            }else if(a.title < b.title){
                return -1
            }else{
                return 0
            }
        });

    }else if(selectSorted === 'z_a'){
            foundFilms.sort((a, b) =>{
                if(a.title > b.title){
                    return -1
                }else if(a.title < b.title){
                    return 1
                }else{
                    return 0
                }
            });

    }else if(selectSorted === 'old_new'){
        foundFilms.sort((a, b) => {
            if(a.release_date > b.release_date){
                return 1
            }else if(a.release_date < b.release_date){
                return -1
            }else{
                return 0
            }
        });

    }else if(selectSorted === 'new_old'){
        foundFilms.sort((a, b) => {
            if(a.release_date > b.release_date){
                return -1
            }else if(a.release_date < b.release_date){
                return 1
            }else{
                return 0
            }
        });

    }

    elInputSearch.value = null

    renderFilms(foundFilms, elMoviesList);
});
