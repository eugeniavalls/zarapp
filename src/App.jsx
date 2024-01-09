import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Gestor } from './pages/Gestor'

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

        </Routes>

      </>
    </BrowserRouter>
  )
}

export default App
