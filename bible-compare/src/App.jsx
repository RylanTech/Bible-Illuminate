import {BrowserRouter, Route, Routes} from 'react-router-dom'
import SelectorPage from './pages/SelectorPage'

function App() {

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<SelectorPage/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
