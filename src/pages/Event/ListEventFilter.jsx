
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../../components/Header";


import SliderEvent from "../../components/SliderEvent";
import Footer from "../../components/Footer";
import EventListings from "../../components/EventListGrid";


const HomePage = () => {
  return (
    <div>
      <Header />
      <SliderEvent />
      <EventListings/>
      <Footer />
    </div>
  );
};