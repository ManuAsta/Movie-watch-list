import React, { useEffect, useRef,useState} from 'react'
import styles from './Form.module.css';
//redux
import {addMovieAsync,MoviesSelector,updateMovieAsync} from "../../redux/reducers/MoviesReducer";
import { useDispatch ,useSelector} from 'react-redux';
export default function Form() {
  
  //local states
  const [title,setTitle]=useState("");
  const [year,setYear]=useState("");
  const [details,setDetails]=useState("");
  const [genre,setGenre]=useState("");

  //when the component loads, i want to focus on title
  const titleRef=useRef();
 

  //redux
  const dispath=useDispatch();
  const {editMovie}=useSelector(MoviesSelector);

  const options=["action","horror","comedy","thriller","romance"]

  useEffect(()=>{
    titleRef.current.focus();
    if(editMovie){
      setDetails(editMovie.details)
      setTitle(editMovie.title)
      setGenre(editMovie.genre)
      setYear(editMovie.year)
    }
  },[editMovie])

  //local function to clear
  function handleClear(){
    setTitle("");
    setGenre("");
    setYear("");
    setDetails("");
  }

  function handleForm(){
    if(!title){
      titleRef.current.focus();
      return;
    }
    const movieObject={
      title,
      year,
      details,
      genre
    }
    
    //if it's not an editMovie
    if(!editMovie){
      dispath(addMovieAsync(movieObject))
    }else{
      const updatedMovie={
        ...editMovie,
        ...movieObject
      }
      // console.log(updatedMovie);
      dispath(updateMovieAsync(updatedMovie))
    }
    handleClear();
  }

  return (
    <div className={styles["form-container"]}>
        <form>
            <div className={styles["form-input"]}>
                <h1>{editMovie? `Edit ${editMovie.title} movie`:"Add a New Movie"}</h1>
                {/* title */}
                <input type='text' placeholder='Movie Title' value={title} ref={titleRef} onChange={(e) => setTitle(e.target.value)}/>
                {/* release year */}
                <input type='text' placeholder='Movie Release Year' value={year} onChange={(e) => setYear(e.target.value)}/>
                {/* genre */}
                <div className={styles["dropdown"]}>
                  <select className={styles["dropdown-select"] } value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="">{genre? genre:"Select a genre"}</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {/* details */}
                <textarea type="text" value={details} placeholder='Details' onChange={(e) => setDetails(e.target.value)}/>

                {/* buttons */}
                <div className={styles["buttons-container"]}>
                  <button className={styles.clear} onClick={(e)=>{
                    e.preventDefault();
                    handleClear();
                  }}>Clear</button>
                  <button className={styles.add} onClick={(e)=>{
                    e.preventDefault();
                    handleForm()
                  }}>{editMovie? "Update":"Add"}</button>
                </div>
            </div>
        </form>
    </div>
  )
}
