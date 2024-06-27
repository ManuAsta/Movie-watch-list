import React from 'react'
//styles
import styles from "./MovieDetails.module.scss"
//reudx
import { useDispatch,useSelector } from 'react-redux'
import {toggleWatchedAsync,MoviesSelector, MoviesActions} from "../../redux/reducers/MoviesReducer"
//routing
import { useNavigate,useParams } from 'react-router-dom'
//components
import poster from "../../images/poster.png"
import Navbar from "../../components/Navbar/Navbar"
import Modal from '../../components/Modal/Modal'
export default function MovieDetails() {

  //redux
  const {movies,showReview} = useSelector(MoviesSelector);
  const { id } = useParams();
  // console.log("id is ",id);
  const movie= movies.find(movie=>movie.id===id)
  console.log(movie)
  const {watched}=movie;
  //routing
  const navigate=useNavigate();
  const dispatch=useDispatch();

  
  return (
    <>  
      {movie &&<div className={styles["movie-page"]}>

      <Navbar/>
      {showReview && <Modal/>} 
      <div className={styles["movie-layout"]}>
        <div className={styles["movie-container"]}>
            <img src={movie.poster? movie.poster:poster} width={"80%"} height={"70%"} alt='poster'/>
          <div>

        <button className={watched? styles["watched-button"]:styles["not-watched"]} onClick={(e)=>{
        e.stopPropagation()
        dispatch(toggleWatchedAsync(movie))
      }}>{watched? "Watched":"Mark as Watched"}</button>
            {/* 
            <button className={styles["delete-btn"]}>Delete</button> */}
            <button className={styles["edit-button"]} onClick={()=>dispatch(MoviesActions.setReviewTrue(movie))}>Rate and Review</button>
            <button className={styles["home-btn"]} onClick={()=>navigate("/")}>Home</button>
          </div>
        </div>
        <div className={styles["details-container"]}>
          <h2>Title: {movie.title}</h2>
          <h3>Original Title:{movie.original_title? movie.original_title : "N/A"}</h3>
          <h3>Genre: {movie.genre? movie.genre:"N/A"}</h3>
          <h3>Release Year: {movie.year? movie.year:"N/A"}</h3>
          <h3>User Rating: {movie.rating} / 5</h3>
          <h3>Details: {movie.details? movie.details:"N/A"}</h3>
          <h4>Overview:{movie.description? movie.description:"N/A"}</h4>
        </div>
      </div>
      {movie.reviews && movie.reviews.length>0 &&
      <div className={styles["reviews"]}>
          <h1>Rating and reviews</h1>
          {movie.reviews.map((review,index)=>{
            return(<>
              <h2>{review.name}</h2>
              <div className={styles["box"]}>
                {review.text}
              </div>
            </>)
          })}
          
      </div>
      }
      
    </div>
}

    </>
    
    
  )
}
