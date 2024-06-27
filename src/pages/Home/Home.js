import React,{useEffect } from 'react';

//styles
import styles from "./Home.module.scss";
//redux
import {MoviesSelector,MoviesActions,fetchMoviesAsync} from "../../redux/reducers/MoviesReducer";
import {useSelector,useDispatch} from "react-redux";
//components
import Navbar from '../../components/Navbar/Navbar';
import Form from '../../components/Form/Form';
import Movie from '../../components/Movie/Movie';
import Modal from "../../components/Modal/Modal";



export default function Home() {
  
  // const sortMovies=["All Movies","Watched","Not watched"]
  //redux
  const dispatch=useDispatch();
  const {showForm,movies,showDelete,status} = useSelector(MoviesSelector);
  // const [showMovies,setShowMovies]=useState(sortMovies[0]);
 

  useEffect(() => {
    dispatch(fetchMoviesAsync());
  }, [dispatch]);

  
  return (
    <>
      <Navbar/>
      {showDelete && <Modal/>}
      <div className={styles["home-layout"]}>
        {showForm && <Form/>}

        {/* home Options  */}
        <div className={styles["home-options"]}>
            <div className={styles["movies-showed"]}>
                Showing: My Watch List Movies
                {/* <button className={styles["sort"]} onClick={handleSort}>Sort By watched</button> */}
            </div>
            <div className={styles["options"]}>
                <button className={showForm? styles["cancel"]:styles["add"]} onClick={()=>{
                dispatch(MoviesActions.setEditNull())
                dispatch(MoviesActions.toggleForm())}}>{showForm? "Cancel":"Add Movie"}</button>
            </div>
        </div>

        {/* movies container  */}
        {status==="loading"? <h1>Loading...</h1>:<div className={styles["movies-container"]}>
            {movies && movies.length>0?<>
                {movies.map((movie,index)=><Movie key={index} movie={movie}/>)}
            </>:<h1>No Movies To Show, Please add any</h1>}
        </div>}
      </div>
    </>
  )
}
