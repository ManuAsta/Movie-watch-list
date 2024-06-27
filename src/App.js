//styles
import "./App.css";
//routing
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
//pages
import Home from "./pages/Home/Home";
import MovieDetails from "./pages/Movie Details/MovieDetails";
//redux
import { store } from "./redux/store/store";
import {Provider} from "react-redux";

function App() {

  //two pages in our app
  const router=createBrowserRouter([{
    index:true,
    element:<Home/>
  },{
    path:"movie-details/:id",
    element:<MovieDetails/>
  }])



  return (
    <div className="App">
        <Provider store={store}>
          <RouterProvider router={router}/>
        </Provider>
    </div>
  );
}

export default App;
