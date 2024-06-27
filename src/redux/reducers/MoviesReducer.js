import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { db } from "../../firebase/firebaseinit";
import { collection,query,addDoc, getDocs,deleteDoc,getDoc,doc, orderBy, updateDoc } from "firebase/firestore";
import axios from "axios";


//for more accurate title check
const normalizeTitle = (title) => {
    return title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

//intially movies are empty
const initialState={
    editMovie:null,
    reviewMovie:null,
    showDelete:false,
    deleteMovie:null,
    showReview:false,
    movies:[],
    showForm:false,
    status: 'idle', // or 'loading', 'succeeded', 'failed',
    error: null,
}



//when the page is refreshed, fetch the movies from the firestore and display them
export const fetchMoviesAsync = createAsyncThunk('movies/fetchMovies', async (payload, thunkAPI) => {
    try {
    const moviesRef = collection(db, 'movies');
    const moviesQuery = query(moviesRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(moviesQuery);
      const movies = [];
      querySnapshot.forEach((doc) => {
        movies.push({ id: doc.id, ...doc.data() });
      });
      console.log("Movies from db",movies);
      return movies;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });



//adding movie to the firestore database
export const addMovieAsync=createAsyncThunk("movies/addMovie",
    async(payload,thunkAPI)=>{
        console.log(payload);
        const { title, year, details, genre } = payload;
    
     //if we have the movie from the database then use the poster as well
     let movieObject={
        title,
        year,
        details,
        description:"N/A",
        poster:null,
        genre,
        watched:false,
        rating:0,
        reviews:[],
        original_title:"",
        timestamp: new Date().toISOString(),
    }

    try {
        // Search for the movie using TMDb API
        const apiKey = '1361831950edcb014f1147630dcda6e5';  // Replace with your TMDb API key
        let movies=[];
        try{
            const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: apiKey,
                query: title,
            },
            timeout:7000
            });
            movies = response.data.results;

        }catch(err){
            console.log("Error with movie database",err);
        }
        finally{
             //movie from the the movie database
            let movieFromDB=null;

            // console.log(movies);

            if(movies.length>0){
                //movies with same name and release year
                const filteredMovies=movies.filter(movie => {
                    const movieTitle= movie.title? normalizeTitle(movie.title):""
                    const movieYear = movie.release_date ? movie.release_date.split('-')[0] : null;

                    if(year){
                        return movieTitle===title.toLowerCase() && year===movieYear;
                    }
                    return movieTitle===normalizeTitle(title)
                });
                // console.log("filteredMovies",filteredMovies)
                if(filteredMovies.length>0){
                    movieFromDB=filteredMovies[0];
                }
            }

            if(movieFromDB){
                movieObject={
                    ...movieObject,
                    original_title:movieFromDB.original_title,
                    description:movieFromDB.overview,
                    poster:`https://image.tmdb.org/t/p/w500${movieFromDB.poster_path}`
                }
            }
            // console.log("Movie is",movieObject);
            const docRef = await addDoc(collection(db, 'movies'), movieObject);
            return { id: docRef.id, ...movieObject };
            }
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
)


//updating a movie
export const updateMovieAsync = createAsyncThunk('movies/updateMovie', async (movie, thunkAPI) => {
    // console.log("Movie is ",movie);
    const { id, ...movieData } = movie;
    try {
      const movieDocRef = doc(db, 'movies', id);
      await updateDoc(movieDocRef, movieData);
      return { id, ...movieData };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });


  //for marking as watched or unwatched
  export const toggleWatchedAsync=createAsyncThunk('movies/toggleWatched', async (movie, thunkAPI) => {
    const { id, watched } = movie;
    // console.log("Movie for toggling is",movie);
    try {
      const movieDocRef = doc(db, 'movies', id);
      await updateDoc(movieDocRef, { watched: !watched });
      return { id, watched: !watched };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });


  //for deleting a movie
  export const deleteMovieAsync = createAsyncThunk('movies/deleteMovie', async (movie, thunkAPI) => {
    const { id } = movie;
  
    try {
      const movieDocRef = doc(db, 'movies', id);
      await deleteDoc(movieDocRef);
      thunkAPI.dispatch(MoviesActions.setModelFalse())
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });






//adding a review
export const addReviewAsync = createAsyncThunk(
  'movies/addReview',
  async ({ movieId, reviewText, rating, name }, thunkAPI) => {
      try {
          // Get the movie document
          const movieDocRef = doc(db, 'movies', movieId);
          const movieDoc = await getDoc(movieDocRef);

          if (movieDoc.exists()) {
              let movie = movieDoc.data();

              // Add the new review to the reviews array
              movie.reviews.push({ text: reviewText, rating, name });

              // Calculate the new average rating
              const totalRatings = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
              const averageRating = totalRatings / movie.reviews.length;

              // Update the movie object with the new average rating
              movie.rating = averageRating;

              // Update the movie document in Firestore
              await updateDoc(movieDocRef, {
                  reviews: movie.reviews,
                  rating: averageRating
              });
              thunkAPI.dispatch(MoviesActions.setModelFalse())
              return { id: movieId, reviews: movie.reviews, rating: averageRating };
          } else {
              return thunkAPI.rejectWithValue(`No such movie with ID: ${movieId}`);
          }
      } catch (error) {
          return thunkAPI.rejectWithValue(error.message);
      }
  }
);






//movies slice
const MoviesSlice= createSlice({
    name:"movies",
    initialState,
    reducers:{
        toggleForm:(state,action)=>{
            state.showForm=!state.showForm
        },
        setEditState:(state,action)=>{
            state.showForm=true;
            // console.log(action.payload);
            state.editMovie=action.payload;
        },
        setEditNull:(state,action)=>{
            state.editMovie=null;
        },
        setMovieDetails:(state,action)=>{
            state.movieDetails=action.payload;
            console.log(state.movieDetails);
        },
        setReviewTrue:(state,action)=>{
          state.showReview=true
          state.reviewMovie=action.payload
        },
        setDeleteTrue:(state,action)=>{
          state.showDelete=true;
          state.deleteMovie=action.payload
        },
        setModelFalse:(state,action)=>{
          state.showDelete=false;
          state.showReview=false;
          state.deleteMovie=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        //for fetching movies 
        .addCase(fetchMoviesAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchMoviesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload;
        })
        .addCase(fetchMoviesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        })
        //adding a movie
        .addCase(addMovieAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(addMovieAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.movies.unshift(action.payload);
        })
        .addCase(addMovieAsync.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        //updating a movie
        .addCase(updateMovieAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(updateMovieAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.movies.findIndex(movie => movie.id === action.payload.id);
        if (index !== -1) {
            state.movies[index] = action.payload;
        }
        })
        .addCase(updateMovieAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        })
         // toggling watched 
        .addCase(toggleWatchedAsync.pending, (state) => {
            state.status = "";
            state.error = null;
        })
        .addCase(toggleWatchedAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const index = state.movies.findIndex(movie => movie.id === action.payload.id);
            if (index !== -1) {
            state.movies[index].watched = action.payload.watched;
            
            }
        })
        .addCase(toggleWatchedAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        // deleting the movie from the database
        .addCase(deleteMovieAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(deleteMovieAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.movies = state.movies.filter(movie => movie.id !== action.payload);
        })
        .addCase(deleteMovieAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        //adding a review
        .addCase(addReviewAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addReviewAsync.fulfilled, (state, action) => {
            state.loading = false;
            const { id, reviews, rating } = action.payload;
            const movieIndex = state.movies.findIndex(movie => movie.id === id);
            if (movieIndex !== -1) {
                state.movies[movieIndex].reviews = reviews;
                state.movies[movieIndex].rating = rating;
            }
        })
        .addCase(addReviewAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})


export const MoviesReducer=MoviesSlice.reducer;
export const MoviesActions=MoviesSlice.actions;
export const MoviesSelector=(state)=>state.MoviesReducer;