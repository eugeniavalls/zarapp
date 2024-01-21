/**
* Este componente carga el gestor, es decir, la página principal
*
* @hook {useNavigate} A partir de la función navigate, permite hacer redirecciones
* @hook {createContext} Se crea el contexto
* @hook {useContext} Usamos el contexto para los otros componentes
* @hook {useEffect} Hace una llamada al fetch
* @hook {useState} Nos permite buscar las imágenes del Slider
*/

import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from "react"
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'

// Se crea el contexto
const HeaderContext = createContext()

/**
* Este componente hace la llamada a la API para poder visualizar las imágenes del Slider. No era necesario para los requerimientos del proyectos, pero se ha realizado como extra consultando algunas funcionalidades con ChatGPT
*
* @hook {useNavigate} a partir de la función navigate, permite hacer redirecciones
* @hook {useState} Nos permite buscar las imágenes del Slider
* @hook {useEffect} Hace una llamada al fetch
*/

export const Gestor = () => {

    const { VITE_URL_API } = import.meta.env

    //Para hacer redirecciones
    const navigate = useNavigate()

    //useState para buscar las imágenes del Slider y hacer que solo se visualize una de las 5 cada vez
    const [sliders, setSlider] = useState([])
    const [active, setActive] = useState(0)

    // setActive empieza en 0, por lo tanto cambiamos el estado al ir hacia delante y la añadimos +1, esto hará cambiar de imagen a la siguiente, cuando active llegue al final del total de las imagenes (5) entonces vuelve al inicio (0)
    const nextHandler = () => {
        setActive(active + 1)

        if (active >= sliders.length - 1) {
            setActive(0)
        }
    }

    // Para retroceder, misma lógica que nextHandler
    const prevHandler = () => {
        setActive(active - 1)
        if (active <= 0) {
            setActive(sliders.length - 1)
        }
    }

    //Consultado algunos parametros con ChatGPT
    // Se crea una variable y se le asigna el valor actual del tiempo usando Date.now, se utiliza para realizar un seguimiento del tiempo
    let lastScrollTime = Date.now()

    const handleWheel = (event) => {
        //Valor actual del tiempo del scroll 
        const now = Date.now()
        //Desplazamiento en vertical
        const delta = event.deltaY

        //Si ha pasado menos de 1 segundo no realiza ninguna accion, para evitar cambios rapidos
        if (now - lastScrollTime < 1000) {
            return
        }

        //Se actualiza la varaible con el valor actual del tiempo
        lastScrollTime = now

        // Si delta es mayor que 0, el scroll hacia abajo, se llama a nextHandler para pasar a la siguiente imagen, sino scroll hacia arriba y pasa a la imagen anterior
        if (delta > 0) {
            //Scroll hacia abajo
            nextHandler()
        } else {
            //Scroll hacia arriba
            prevHandler()
        }
    }

    //Cuando se pulse en el botón rebajas entonces navega a {/rebajas}
    const rebajasHandler = () => navigate('/rebajas')
    //Cuando se pulse en el logo entonces navega a {/gestor}
    const logoHandler = () => navigate('/gestor')
    //Cuando se pulse en el botón wishlist entonces navega a {/wishlist}
    const wishlistHandler = () => navigate('/wishlist')

    useEffect(() => {
        // Si no se ha iniciado la sesión, redirige a login
        if (!localStorage.getItem('usuarios')) {
            navigate('/')
        } else {
            //Si los datos de inicio de sesión existen entonces navega al gestor
            navigate('/gestor')
        }

        let controller = new AbortController()

        //Opciones indicando el método get, no hay que convertir a String
        let options = {
            method: 'get',
            headers: {
                "Content-type": "application/json"
            },
            signal: controller.signal
        }

        //Llamada a la API con las opciones definidas arriba previamente
        fetch(`${VITE_URL_API}gestor`, options)
            .then(res => res.json())
            .then(data => {
                console.clear()
                console.log(data)
                //Actualizamos el estado
                setSlider(data)
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())

    }, [])

    //Agrega un event listener cuando el componente se monta
    useEffect(() => {
        //Agregar event listener a toda la ventana para el evento de desplazamiento ("wheel"). Cada vez que haya un desplazamiento entonces handleWheel
        window.addEventListener("wheel", handleWheel)

        //Limpiar el evenet listener al desmontar el componente
        return () => {
            window.removeEventListener("wheel", handleWheel)
        }
    }, [nextHandler, prevHandler])

    return (

        /**
         * Este contexto se utiliza para gestionar la página principal
         * @HeaderContext
         * @rebajasHandler {Function} Botón para acceder a la página de rebajas
         * @logoHandler {Function} Botón para acceder a la página principal (la actual)
         * @sliders  del useSate, para pintar las imágenes
         * @active  del useSate, para que solo se visualize una y no las cinco
         * @prevHandler {Function} Hace que al hacer scroll hacia arriba se vea la imagen anterior
         * @nextHandler {Function} Hace que al hacer scroll hacia abajo se vea la imagen siguiente
        */

        <HeaderContext.Provider value={{ rebajasHandler, logoHandler, wishlistHandler, sliders, active, prevHandler, nextHandler }}>
            <Header />
            <Rebajas />
            <Slider />
        </HeaderContext.Provider>
    )
}

/**
 * Componente Header
 * Descripción: Este componente carga el Header de la página principal
 * Estructura: 
 *  - Header
 *      - Sección donde introducimos el logo en este caso color amarillo y el botón de wishlist que  redirige al apartado wishlist (/wishlist) 
 */
const Header = () => {
    /**
    * Este contexto hace referencia a HeaderContext
    */
    const { logoHandler, wishlistHandler } = useContext(HeaderContext)

    return (
        <header className='Header Header-gestor'>
            <section className='Header-section'>
                <h1 className='Header-h1'>

                    <img src="/logo-yellow.svg" alt="Zara" className='Header-image' onClick={logoHandler} />

                </h1>
                <nav className='Header-nav Header-nav-wishlist' onClick={wishlistHandler}>
                    <ul className='Header-ul Header-wishlist'> WISHLIST </ul>
                </nav>
            </section>
        </header>
    )
}

/**
 * Componente Rebajas
 * Descripción: Este componente carga el botón de rebajas
 * Estructura: 
 *  - Botón que al hacer click redirige al apartado de rebajas (/rebajas)
 */
const Rebajas = () => {
    /**
    * Este contexto hace referencia a HeaderContext
    */
    const { rebajasHandler } = useContext(HeaderContext)
    return (

        <button className='Rebajas-button' onClick={rebajasHandler}>
            REBAJAS
        </button>

    )
}

/**
 * Componente Slider
 * Descripción: Este componente carga las imágenes del slider
 * Estructura: 
 *  - Main
 *      - Contenedor general
 *          - Contenedor del Slider
 *              - Map del slider
 *                  - Imagen del slider
 */
const Slider = () => {
    /**
    * Este contexto hace referencia a HeaderContext
    */
    const { sliders, active } = useContext(HeaderContext)

    return (
        <main className='Main'>
            <div className='Slider'>
                <div className='Slider-container'>
                    {/* Si es mayor que 0 entonces haz un map de todas las imágenes que hay */}
                    {sliders.length > 0 &&
                        sliders.map((eachSlider, index) => (
                            <img
                                key={index}
                                src={eachSlider.src}
                                alt={eachSlider.alt}
                                className='Slider-img'
                                style={{
                                    //Muestra solo la imagen activa
                                    display: index === active ? 'block' : 'none'
                                }}
                            />
                        ))
                    }
                </div>
            </div>
        </main>
    )
}

