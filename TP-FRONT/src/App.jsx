import './App.css';
import YouTube from 'react-youtube';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import logo from './assets/logo.jpg'

function App() {
  const Api_url = 'https://api.themoviedb.org/3';
  const Api_key = '3a2ebea3780f73bf17ab89329c335b55';
  const Url_Image = 'https://image.tmdb.org/t/p/original/';
  const Url_Path ='https://image.tmdb.org/t/p/original/';
  
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const fetchMovies = async (searchKey) => {
    try {
      const type = searchKey ? 'search' : 'discover';
      const { data: { results } } = await Axios.get(`${Api_url}/${type}/movie`, {
        params: {
          api_key: Api_key,
          query: searchKey,
        },
      });

      setMovies(results);
      setMovie(results[0]);

      if (results.length) {
        await fetchMovie(results[0].id);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchMovie = async (id) => {
    try {
      const { data } = await Axios.get(`${Api_url}/movie/${id}`, {
        params: {
          api_key: Api_key,
          append_to_response: "videos",
          language : "es",
        },
      });

      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find(
          (vid) => vid.name === "Official Trailer"
        );
        setTrailer(trailer ? trailer : data.videos.results[0]);
      }

      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const selectMovie = async (selectedMovie) => {
    fetchMovie(selectedMovie.id);
    setMovie(selectedMovie);
    window.scrollTo(0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
    console.log(Url_Path)
  };

  useEffect(() => {
    fetchMovies('');
  }, []);

  const addToFavorites = (selectedMovie) => {
    if (!favorites.find((movie) => movie.id === selectedMovie.id)) {
      setFavorites([...favorites, selectedMovie]);
    }
  };
  
  return (
    <>
      <header>
      <img src={logo} alt="" className='logo' />
        <h1> Movie Time </h1>
      </header>
      <div className='input-field'>
        <form onSubmit={searchMovies}>
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            required
          />
          <button type='submit' className='btn'> BUSCAR </button>
        </form>
      </div>
  
      <div>
        <main>
          {movie ? (
            <div
              className='viewtrailer'
              style={{
                backgroundImage:`url("${Url_Image}${movie.backdrop_path}")`,
                
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className='reproductor-container'
                    containerClassname={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className='boton'> Close </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white ">{movie.title}</h1>
                    <p className="text-white ">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
  
      <div className="container mt-3 text-center">
        <div className="row">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-md-4 mb-3 mt-3"
              onClick={() => selectMovie(movie)}
            >
              <img
                src={`${Url_Image}${movie.poster_path}`}
                alt=""
                height={300}
                width="75%"
               
              />
             <h4 className="text-center">{movie.title}</h4>
              
              <button
                onClick={() => addToFavorites(movie)}
                className="btn btn-primary mt-3"
              >
                Agregar a Favoritos
              </button>
            
              <button
                onClick={() => setMovie(movie)}
                className="btn btn-secondary text-black mt-3" 
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>

     
      <div className="container mt-3 justify-content-center">
        <h2 className='text-white mt-5 text-center'>Detalles de la película</h2>
        <div className="row">
          <div className="col-md-4 d-flex flex-column align-items-center mt-3">
            <img
              src={`${Url_Image}${movie.poster_path}`}
              alt=""
              height={300}
              width="75%"
            />
          </div>
          <div className="col-md-8 mt-5">
            <h3 className='text-white'>{movie.title}</h3>
            <p className='text-white'>{movie.overview}</p>
          
          </div>
        </div>
      </div> 
      
    </>
  );
}

export default App;
