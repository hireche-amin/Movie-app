
import { useState,useEffect } from 'react';
import { useDebounce } from 'react-use';
import './App.css';
import Search from './components/search';
import Spinner from './components/spinner';
import MoviesCard from './components/MovieCard';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
//console.log('API_KEY:',API_KEY);
const API_OPTIONS = {
  method : 'GET' ,
  headers : {
    accept : 'application/json',
    Authorization : `Bearer ${API_KEY}`
  }
  }

const App = () => {
  const [searchTerm,setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [movieList,setMovieList] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true); 
    setErrorMessage('');
    try { 
      const endpoint = query ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc` ;
      const response = await fetch(endpoint,API_OPTIONS);
      if(!response.ok){
        throw new Error('failed to fetch movies')
      }
      const data = await response.json();
      if (data.response === 'false') {
        setErrorMessage(data.Error || 'failed to fetch movies')
          setMovieList([]); 
      return
      }
        setMovieList(data.results || []);

      //console.log(data); 
    }catch (error) {
      console.error(`error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. please try again later')
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect (()=> {
      fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className='pattern'/>
        <div className='wrapper'>
          <header>
            <img src='./hero-img.png' alt='hero banner'/>
            <h1>Find <span className='text-gradient'>Movies</span> You'll Will Enjoy Without the Hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          <section className='all-movies'>
          <h2 className='mt-[40px]'>All movies</h2>
          {isLoading ? (
          <Spinner/>
          ): errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):( <ul>
            {movieList.map((movie) => (
              <MoviesCard key={movie.id} movie={movie} />
            ))}
            </ul>)}
          
        </section>
        </div>
    </main>
  )

}

export default App
