import axios from 'axios';
import { setMovies, setGenres, setHearted, setLogs } from './actions';
import { endpoints } from '../config';

export const addLogEvent = (logText, logsList) => (dispatch) => {
  const now = new Date();
  const eventTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const eventDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const fullEventDate = `${eventDate} ${eventTime}`;
  dispatch(setLogs([ ...logsList, `${fullEventDate}: ${logText}`]));
};

export const getMovies = () => (dispatch) => {
  // thunk - dispatch actions when needed
  axios
    .get(endpoints.mostPopularMovies())
    .then((res) => {
      dispatch(setMovies(res.data.results))
    })
    .catch((error) => console.log(error));
};

export const getGenreMovies = (genre, logsList) => (dispatch) => {
  dispatch(addLogEvent(`Pakeistas zanras i ${genre.name}`, logsList));
  axios
    .get(endpoints.genreMovies(genre.id))
    .then((res) => {
      dispatch(setMovies(res.data.results));
    })
    .catch((error) => console.log(error));
};

export const getGenres = () => (dispatch) => {
  axios
    .get(endpoints.genres())
    .then((res) => {
      dispatch(setGenres(res.data.genres));
    })
    .catch((error) => console.log(error));
};

export const addHearted = (movie, heartedList, logsList) => (dispatch) => {
  dispatch(setHearted([...heartedList, movie.id]));
  dispatch(addLogEvent(`Uzdeta sirdele filmui ${movie.original_title}`, logsList));
};

export const removeHearted = (movie, heartedList, logsList) => (dispatch) => {
  dispatch(setHearted(
    heartedList.filter((currentId) => currentId !== movie.id)
  ));
  dispatch(addLogEvent(`Nuimta sirdele filmui ${movie.original_title}`, logsList));
};