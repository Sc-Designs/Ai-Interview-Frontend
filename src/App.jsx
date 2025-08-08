import React from 'react'
import AllRouters from './Routes/AllRouters'
import TostContainer from './Components/TostContainer';
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const App = () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return (
    <>
      <TostContainer />
      <AllRouters />
    </>
  );
}

export default App