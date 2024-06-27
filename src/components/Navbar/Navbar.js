import React from 'react'
//styles
import styles from "./Navbar.module.css";
//images
import watchlist from "../../images/watchlist.png";
//routing
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

  const navigate=useNavigate();
  return (
    <>
      <div className={styles.navbar} onClick={()=>{
        navigate("/")
      }}>
        <img src={watchlist} alt='Restaurant Icon' width={"50px"} height={"50px"}/>
        <h3>My Movie Watchlist</h3>
      </div>
    </>
  )
}
