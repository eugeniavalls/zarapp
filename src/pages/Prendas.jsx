/**
* Este componente carga las prendas
*
* @hook {useNavigate} A partir de la función navigate, permite hacer redirecciones
* @hook {createContext} Se crea el contexto
* @hook {useContext} Usamos el contexto para los otros componentes
* @hook {useEffect} Hace una llamada al fetch
* @hook {useState} Nos permite buscar las imágenes de las prendas
*/

import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from "react"
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'
import '/src/styles/Prendas.css'
import '/src/styles/PopUp.css'

// Se crea el contexto
const PrendasContext = createContext()

/**
* Componente Prendas 
* Este componente hace la llamada a la API para poder visualizar las imágenes de las prendas. Se ha intentado hacer un popUp para que cuando se hace click en el icono de guardar apareciera un aviso de "Prenda guardada en la wishlist", pero no se ha conseguida, se ha dejado el código comentado
*
* @hook {useNavigate} a partir de la función navigate, permite hacer redirecciones
* @hook {useState} Nos permite buscar las prendas
* @hook {useEffect} Hace una llamada al fetch
*/

export const Prendas = () => {
    const { VITE_URL_API } = import.meta.env

    //Para hacer redirecciones
    const navigate = useNavigate()

    //Cuando se pulse en el logo entonces navega a {/gestor}
    const logoHandler = () => navigate('/gestor')
    //Cuando se pulse en el botón wishlist entonces navega a {/wishlist}
    const wishlistHandler = () => navigate('/wishlist')

    //UseState para buscar los elementos del array de prendas
    const [prendas, setPrendas] = useState([])
    //UseState para almacenar la Wishlist
    const [wishlist, setWishlist] = useState([])


    //Pop up wishlist
    // const [wishlistPopUp, setWishlistPopUp] = useState({})
    // const botonWishlistPopUp = async () => {
    //     await agregarWishlist(props)
    //     setWishlistPopUp(!wishlistPopUp)
    //     setTimeout(()=>{
    //         setWishlistPopUp(false)
    //     }, 2000)
    // }

    //Añadir esa prenda a la wishlist
    const agregarWishlist = async (producto) => {

        //Props que estan en la bbdd de prendas
        let nuevo = {
            src: producto.src,
            alt: producto.alt,
            prendaName: producto.prendaName,
            prendaPriceActual: producto.prendaPriceActual,
            prendaPriceDisccount: producto.prendaPriceDisccount,
            prendaPriceLast: producto.prendaPriceLast,
            prendaPriceOld: producto.prendaPriceOld,
            talla: producto.talla
        }

        console.log(nuevo)

        //Se cambia el estado con las props
        setWishlist([nuevo])

        let controller = new AbortController()

        //Opciones indicando el método post, hay que convertir a String, para añadir la prenda a la wishlist
        let options = {
            method: 'post',
            //Convertir a stringify
            body: JSON.stringify(nuevo),
            headers: {
                "Content-type": "application/json"
            },
            signal: controller.signal
        }

        //Llamada a la API con las opciones definidas arriba previamente para el apartado de wishlist
        fetch(`${VITE_URL_API}wishlist`, options)
            .then(res => res.json())
            .then(data => {
                console.clear()
                console.log("Datos de la API", data)
                setWishlist(data)

                //Actualizamos el estado del pop up individual para la prenda actual
                // setWishlistPopUp(prevState => ({
                //     ...prevState,
                //     [producto.id]: true
                // })) 

                // setTimeout(()=> {
                //     Restablecemos el estado del popup individual despues de un tiempo
                //     setWishlistPopUp(prevState => ({
                //         ...prevState, 
                //         [producto.id]: false
                //     }))
                // }, 2000)
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())
    }

    //useEffect para pintar en {/rebajas} todas las prendas que hay en la bbdd
    useEffect(() => {
        // Si no se ha iniciado la sesión, redirige a login
        if (!localStorage.getItem('usuarios')) {
            navigate('/')
        } else {
            //Si los datos de inicio de sesión existen entonces navega a rebajas
            navigate('/rebajas')
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

        //Llamada a la API con las opciones definidas arriba previamente para el apartado rebajas
        fetch(`${VITE_URL_API}rebajas`, options)
            .then(res => res.json())
            .then(data => {
                console.clear()
                console.log("Datos de la API", data)
                //Actualizamos el estado
                setPrendas(data)
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())

    }, [])


    return (
        /**
         * Este contexto se utiliza para gestionar la página de rebajas y añadir x prenda a la wishlist
         * @PrendasContext
         * @logoHandler {Function} Botón para acceder a la página principal {/gestor}
         * @wishlistHandler {Function} Botón para acceder a la página de wishlist {/wishlist}
         * @prendas  del useSate, para pintar las prendas
         * @agregarWishlist {Function} Botón para guardar x prenda a la wishlist
        */

        <PrendasContext.Provider value={{ logoHandler, wishlistHandler, prendas, agregarWishlist }}>
            <Header />
            <Articulos />
        </PrendasContext.Provider>
    )
}

/**
 * Componente Header
 * Descripción: Este componente carga el Header de la página de {/rebajas}
 * Estructura: 
 *  - Header
 *      - Sección donde introducimos el logo en este caso color negro y el botón de wishlist que  redirige al apartado wishlist (/wishlist) 
 */

const Header = () => {
    /**
    * Este contexto hace referencia a PrendasContext
    */
    const { logoHandler, wishlistHandler } = useContext(PrendasContext)

    return (
        <header className='Header'>
            <section className='Header-section'>
                <h1 className='Header-h1'>
                    <img src="/logo.svg" alt="Zara" className='Header-image' onClick={logoHandler} />
                </h1>
                <nav className='Header-nav Header-nav-wishlist' onClick={wishlistHandler}>
                    <ul className='Header-ul Header-wishlist'> WISHLIST </ul>
                </nav>
            </section>
        </header>
    )
}

/**
 * Componente Articulos
 * Descripción: Este componente carga las prendas
 * Estructura: 
 *  - Main
 *      - Contenedor general
 *          - Contenedor de las prendas
 *              - Map de las prendas
 *                  - Componente Prenda
 */
const Articulos = () => {
    /**
    * Este contexto hace referencia a PrendasContext
    */
    const { prendas, agregarWishlist } = useContext(PrendasContext)
    return (
        <main className='Main'>
            <div className='Prendas'>
                <div className='Prendas-container'>
                    {prendas.map((eachPrenda) => (
                        <Prenda
                            key={eachPrenda.id}
                            {...eachPrenda}
                            //Agrega la prenda a la wishlist
                            agregarWishlist={agregarWishlist}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}

/**
 * Componente Prenda
 * Descripción: Este componente contiene la estructura de la prenda
 * Estructura: 
 *  - Contenedor prenda
 *      - Imagen de la prenda
 *      - Contenedor información de la prenda
 *          - Contenedor de texto de la prenda
 *              - Texto del nombre de la prenda
 *              - Icono de guardar en wishlist
 *      - Contenedor precio de la prenda
 *          - Precio antiguo
 *          - Precio último 
 *          - Contenedor precio actual
 *              - Descuento
 *              - Precio actual 
 */
const Prenda = (props) => {
    //Propiedades que vienen de la API, de la coleccion 'prendas'
    const { src, alt, prendaName, prendaPriceActual, prendaPriceDisccount, prendaPriceLast, prendaPriceOld, talla, agregarWishlist } = props

    // const {wishlistPopUp} = useContext(PrendasContext)

    // const handleClick = () => {
    //     if(botonWishlistPopUp){
    //         botonWishlistPopUp(props)
    //     }
    // }

    return (
        <div className='Prenda'>
            <img src={src} alt={alt} className='Prenda-img' />
            <div className='Prenda-info'>
                <div className='Prenda-text' >
                    <p className='Prenda-name'>{prendaName}</p>
                    {/* Añadir prenda a la wishlist */}
                    {agregarWishlist && (
                        <img src="/icon-wishlist.svg" alt="Wishlist" className='Prenda-icon' onClick={() => agregarWishlist(props)} />
                    )}
                </div>

                {/* <div className={`PopUp-wishlist${wishlistPopUp ? "isVisible" : ""}`}>
                    <p>Se ha añadido la prenda a tu Wishlist</p>
                </div> */}

                <div className='Prenda-price'>
                    <p className='Prenda-price-old'>{prendaPriceOld}</p>
                    <p className='Prenda-price-last'>{prendaPriceLast}</p>
                    <div className='Prenda-price-now'>
                        <p className='Prenda-price-disccount'>{prendaPriceDisccount}</p>
                        <p className='Prenda-price-actual'>{prendaPriceActual}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}





