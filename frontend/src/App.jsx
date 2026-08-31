
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserData } from "./context/UserContext";
import Verify from "./pages/Verify";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Loading from "./components/Loading";
import Products from "./pages/Products";
import Cart from "./pages/Cart";

function App() {

  const { isAuth ,loading}=UserData();
 
  return (
    <>
      {loading ?(
        <Loading/>
      ) :(
        <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuth ? <Home/> :<Login />} />
          <Route path="/verify" element={isAuth ? <Home/> :<Verify />} />
          <Route path="/products" element={<Products/>} />
           <Route path="/cart" element={isAuth?<Cart/>:<Login/>} />

          //Footer Routes
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />   
        </Routes>
        <Footer />
      </BrowserRouter>
      )}

    </>

  );
}

export default App;