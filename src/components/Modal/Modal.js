import React, { useState } from 'react'
//styles
import styles from "./Modal.module.scss"
//images
import close from "../../images/close.png";
import add from "../../images/add.png";
import minus from "../../images/minus.png";
//reudx
import { useSelector ,useDispatch} from 'react-redux';
import {MoviesActions, MoviesSelector,deleteMovieAsync,addReviewAsync} from "../../redux/reducers/MoviesReducer"
export default function Modal() {

  let [rating, setRating] = useState(0);
  const [review,setReview]=useState("");
  const [name,setName]=useState("");
  const {showDelete,showReview,deleteMovie,reviewMovie}=useSelector(MoviesSelector);
  const dispatch=useDispatch();

  const handleYes=()=>{
    console.log(deleteMovie);
    if(deleteMovie){
      dispatch(deleteMovieAsync(deleteMovie));
     
    }
  }

  const handleNo=()=>{
    dispatch(MoviesActions.setModelFalse())
  }

  
  const handleIncrease=()=>{
   if(rating<5){
    setRating(rating+0.5)
   }
  }

  const handleDecrease=()=>{
    if(rating>0){
      setRating(rating-0.5)
    }
  }

  const handleFormSubmission=()=>{
    if(rating===0 && review===""){
      return;
    }
    
    // console.log(reviewMovie);
    let object={
      reviewText:review,
      rating,
      name:name? name: `Anonymous${new Date().toISOString().slice(-3)}`,
      movieId:reviewMovie.id
    }
    dispatch(addReviewAsync(object));
  }

  return (
    <div className={styles.modal}>

         {showDelete &&  <div className={styles["delete-prompt"]}>
           <h1>Do you Really want to delete?</h1>
           <div className={styles["justify-between"]}>
              <button className={styles["no"]} onClick={handleNo}>No</button>
              <button className={styles["yes"]} onClick={handleYes}>Yes</button>
           </div>
        </div>}



         {showReview && <div className={styles["review-form"]}>
          <div className={styles["row-last"]}>
            <img alt='close' src={close} width={"50px"} height={"50px"} onClick={()=>dispatch(MoviesActions.setModelFalse())}/>
          </div>
          <div>
            <h2>Your Rating and review matters!</h2>
            <input onChange={(e)=>setName(e.target.value)}  value={name? name:`Anonymous${new Date().toLocaleDateString().slice(-3)}`}></input>
            <div className={styles["rating"]}>
              <h3>Please Rate:</h3> 
              <button onClick={handleDecrease}>
              <img alt='minus' src={minus} width={"50px"} height={"50px"}/>
              </button>
              <h1>{rating}</h1>
              <button onClick={handleIncrease}>
              <img alt='add' src={add} width={"50px"} height={"50px"}/>
              </button>
            </div>
            <div>
                <textarea onChange={(e)=>setReview(e.target.value)} className={styles["review"]} placeholder='Write a Review '></textarea>
            </div>
          </div>
          <div className={styles["center"]}>
            <button onClick={handleFormSubmission} className={styles["submit-btn"]}>
              Submit
            </button>
          </div>
        </div>

}
        
       
    </div>
  )
}
