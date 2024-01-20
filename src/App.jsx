/* ------------------------------------- *\ 
 * Enrutamiento mediante react-router-dom (useNavigate)
 * Componente Login.jsx
 *  Hooks: 
 *    - useEffect, useRef
 *  Datos: 
 *    - API fetch a VITE_URL_API en local (http://localhost:3000/)
 *    - API fetch a VITE_URL_API en produccion (VITE_URL_API="https://api-zara.vercel.app/")
 *  Estructura: 
 *    - Componente Header
 *    - Formulario de acceso
 * 
 * Componente Gestor.jsx
 *  Hooks: 
 *    - createContext, useContext, useEffect, useRef, useState 
 *  Datos: 
 *    - API fetch a `{VITE_URL_API}gestor` en local (http://localhost:3000/gestor)
 *    - API fetch a `{VITE_URL_API}gestor` en produccion (VITE_URL_API="https://api-zara.vercel.app/gestor")
 *  Estructura: 
 *    - Componente Header
 *    - Componente Rebajas
 *    - Componente Slider
 * 
 * Componente Prendas.jsx
 *  Hooks: 
 *    - createContext, useContext, useEffect, useState
 *  Datos: 
 *    - API fetch a `{VITE_URL_API}rebajas` en local (http://localhost:3000/rebajas)
 *    - API fetch a `{VITE_URL_API}rebajas` en produccion (VITE_URL_API="https://api-zara.vercel.app/rebajas")
 *    - API fetch a `{VITE_URL_API}wishlist` en local (http://localhost:3000/wishlist)
 *    - API fetch a `{VITE_URL_API}wishlist` en produccion (VITE_URL_API="https://api-zara.vercel.app/wishlist")
 *  Estructura: 
 *    - Componente Prendas
 *         - Componente Header
 *         - Componente Articulos
 *              - Componente Prenda
 * 
 * Componente Wishlist.jsx: 
 *  Hooks: 
 *    - createContext, useContext, useEffect, useState
 *  Datos:
 *    - API fetch a `{VITE_URL_API}wishlist` en local (http://localhost:3000/wishlist)
 *    - API fetch a `{VITE_URL_API}wishlist` en produccion (VITE_URL_API="https://api-zara.vercel.app/wishlist")
 *    - API fetch a `{VITE_URL_API}wishlist/id` en local (http://localhost:3000/wishlist/id)
 *    - API fetch a `{VITE_URL_API}wishlist/id` en produccion (VITE_URL_API="https://api-zara.vercel.app/wishlist/id")
 *  Estructura: 
 *    - Componente Wishlist
 *        - Componente Header
 *        - Componente Articulos
 *            - Componente Prenda
------------------- */


import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Gestor } from './pages/Gestor'
import { Prendas } from './pages/Prendas'
import { Wishlist } from './pages/Wishlist'

function App() {

  return (
    /**
     * React-router-dom
     * 
     * @route {/} Cargamos la página inicial de login y el componente <Login/>
     * @route {/gestor} Cargamos la pagina de gestor y el componente <Gestor/> si he iniciado sesión
     * @route {/rebajas} Cargamos la pagina de rebajas y el componente <Prendas/> si he iniciado sesión y al hacer click en el botón rebajas
     * @route {/wishlist} Cargamos la pagina de wishlist y el componente <Wishlist/> si he iniciado sesión y al hacer click en el boton wishlist
     * 
     */
    <BrowserRouter>
      <>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/gestor" element={<Gestor />} />
          <Route path="/rebajas" element={<Prendas />} />
          <Route path="/wishlist" element={<Wishlist />} />

        </Routes>

      </>
    </BrowserRouter>
  )
}

export default App
