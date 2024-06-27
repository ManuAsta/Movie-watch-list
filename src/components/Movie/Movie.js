import React, { useEffect } from 'react'
import styles from "./Movie.module.scss"
import poster from "../../images/poster.png"
import pencil from "../../images/pencil.png"
import trash from "../../images/trash.png"
//redux
import {MoviesActions,toggleWatchedAsync,deleteMovieAsync} from "../../redux/reducers/MoviesReducer"
import { useDispatch } from 'react-redux'
//router
import {useNavigate} from "react-router-dom"


export default function Movie(props) {
  // console.log(props.movie);
  const {title,watched}=props.movie;
  const moviePoster=props.movie.poster;
  // console.log(moviePoster);
  //redux
  const dispatch=useDispatch();
  const navigate=useNavigate();
  //for toggling watched
  const handleWatched=(movie)=>{
    dispatch(toggleWatchedAsync(movie))
  }

  const handleDelete=(movie)=>{
    dispatch(MoviesActions.setDeleteTrue(movie))
  }

  const handleClick=(movie)=>{
    dispatch(MoviesActions.setMovieDetails(movie))
    navigate(`/movie-details/${movie.id}`)
  }
 
  

  return (
    <div className={styles.movie} onClick={()=>handleClick(props.movie)}>
      {/* name  */}
      <h3>{title}</h3>
      {/* poster  */}
      <img src={moviePoster? moviePoster:poster} alt="poster" width={"90%"} height={"60%"}/> 
      {/* options  */}
      <div className={styles.options}>
        <img src={pencil} alt='edit' onClick={(e)=>{
                                                 e.stopPropagation();
                                                 dispatch(MoviesActions.setEditState(props.movie))
                                                 }} className={styles["option-button"]}/>
        <img src={trash} alt='delete' onClick={(e)=>{
                                                e.stopPropagation();
                                                handleDelete(props.movie);
                                              }} className={styles["option-button"]}/>
      </div>
      {/* watch button  */}
      <button className={watched? styles["watched-button"]:styles["not-watched"]} onClick={(e)=>{
        e.stopPropagation()
        handleWatched(props.movie)
      }}>{watched? "Watched":"Mark as Watched"}</button>
    </div>
  )
}
