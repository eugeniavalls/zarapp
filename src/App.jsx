import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Gestor } from './pages/Gestor' 
import { Prendas } from './pages/Prendas'
import { Wishlist } from './pages/Wishlist'

function App() {

  return (
    <BrowserRouter>
      <>

        {/* Enrutamiento básico */}
        <Routes>
          {/* Cargará la página inicial de login */}
          <Route path="/" element={ <Login/>}/>
          {/* Cargará la página de gestor si he iniciado sesión*/}
          <Route path="/gestor" element={ <Gestor/>} />

          {/* Cargará la página de rebajas al hacer clic en el boton*/}
          <Route path="/rebajas" element={ <Prendas/>} />

          {/* Cargará la página de wishlist al hacer clic en el boton*/}
          <Route path="/wishlist" element={ <Wishlist/>} />

        </Routes>

      </>
    </BrowserRouter>
  )
}

export default App
