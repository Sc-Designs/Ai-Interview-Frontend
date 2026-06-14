import React, { useEffect } from 'react'
import AllRouters from './Routes/AllRouters'
import TostContainer from './Components/TostContainer';

const App = () => {
  console.log(import.meta.env.VITE_BASE_URL);
  return (
    <>
      <TostContainer />
      <AllRouters />
    </>
  );
}

export default App