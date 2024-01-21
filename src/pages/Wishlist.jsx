/**
* Este componente carga la wishlist
*
* @hook {useNavigate} A partir de la función navigate, permite hacer redirecciones
* @hook {createContext} Se crea el contexto
* @hook {useContext} Usamos el contexto para los otros componentes
* @hook {useEffect} Hace una llamada al fetch
* @hook {useState} Nos permite almacenar las prendas en la wishlist, controlar la visibilidad del popUp de las tallas y seleccionar la talla al actualizar
*/
import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from "react"
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'

// Se crea el contexto
const WishlistContext = createContext()

/**
* Componente Wishlist 
* Este componente nos permite almacenar las prendas en la wishlist, controlar la visibilidad del popUp de las tallas y seleccionar la talla al actualizar
*
* @hook {useNavigate} a partir de la función navigate, permite hacer redirecciones
* @hook {useState} Nos permite almacenar las prendas en la wishlist, controlar la visibilidad del popUp de las tallas y seleccionar la talla al actualizar
* @hook {useEffect} Hace una llamada al fetch
*/
export const Wishlist = () => {
    const { VITE_URL_API } = import.meta.env

    //Para hacer redirecciones
    const navigate = useNavigate()
    
    //Cuando se pulse en el logo entonces navega a {/gestor}
    const logoHandler = () => navigate('/gestor')
    //Cuando se pulse en el botón wishlist entonces navega a {/wishlist}
    const wishlistHandler = () => navigate('/wishlist')

    //UseState para almacenar la Wishlist
    const [wishlist, setWishlist] = useState([])
    //UseState para controlar la visibilidad del pop-up para cada elemento
    const [popUpVisibility, setPopUpVisibility] = useState({})
    //UseState para seleccionar la talla
    const [selectedSize, setSelectedSize] = useState({})

    //Funcion para mostrar el pop up especifico al hacer clic en la imagen, ayuda de entender conceptos mediante chatgpt
    const showPopUp = async (_id, initialSize) => {
        await cargarWishlist()

        //Al hacer un map de las prendas, se crea para que al hacer click en el botón de actualizar no se muestre el pop up en todas las prendas sino en la que se seleccione
        setPopUpVisibility((prevVisibility) => ({
            ...prevVisibility,
            [_id]: !prevVisibility[_id]
        }))

        // Si se proporciona una talla inicial (la S) se usa, de lo contrario, utiliza la talla actualizada
        setSelectedSize((prevSizes) => ({
            ...prevSizes,
            [_id]: initialSize || findTallaById(_id) || 'S',
        }))
    }

    //Funcion para encontrar la talla por _id
    const findTallaById = (_id) => {
        const prenda = wishlist.find((item) => item._id === _id)
        return prenda ? prenda.talla : null
    }

    // Para que la wishlist cargue al renderizar el componente y no haya que recargar la pagina cada vez
    const cargarWishlist = async () => {
        let controller = new AbortController()

        //Opciones indicando el método post, hay que convertir a String, para visualizar la prenda en la wishlist
        let options = {
            method: 'get',
            headers: {
                "Content-type": "application/json"
            },
            signal: controller.signal
        }

        //Llamada a la API con las opciones definidas arriba previamente
        await fetch(`${VITE_URL_API}wishlist`, options)
            .then(res => res.json())
            .then(data => {
                console.clear()
                console.log("Datos de la API", data)
                setWishlist(data)
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())
    }

    //useEffect para pintar en {/wishlist} todas las prendas que hemos dado click al boton de guardar wn wishlist
    useEffect(() => {
        // Si no se ha iniciado la sesión, redirige a login
        if (!localStorage.getItem('usuarios')) {
            navigate('/')
        } else {
            //Si los datos de inicio de sesión existen entonces navega a la wishlist
            navigate('/wishlist')
        }
        //Cargar la wishlist al renderizar el componente
        cargarWishlist() 
    }, [])

    //Funcion para eliminar la prenda desde la Wishlist
    const eliminarPrendaWishlist = async (id) => {
        try {
            let controller = new AbortController()

            //Opciones indicando el método delete, no hay que convertir a String, para eliminar la prenda en la wishlist
            let options = {
                method: 'delete',
                headers: {
                    "Content-type": "application/json"
                },
                signal: controller.signal
            }

            //Llamada a la API con las opciones definidas arriba previamente, pasandole el id
            await fetch(`${VITE_URL_API}wishlist/${id}`, options)

            //Despues de elimnar la prenda, cargar de nuevo la wishlist
            cargarWishlist()

        } catch (error) {
            console.log(error)
        }
    }

    //Funcion para actualizar la talla de la prenda desde la Wishlist
    const updateSelectedSize = (_id, size) => {
        //Se actualiza el esta de selectedSize, copiando las propiedades existente del objeto
        setSelectedSize((prevSizes) => ({
            ...prevSizes,
            [_id]: size
        }))
    }

    //Funcion para actualizar la talla, boton de actualizar
    const handleUpdateTalle = async (_id) => {
        try {
            let controller = new AbortController()

            //Opciones indicando el método put, hay que convertir a String
            let options = {
                method: 'put',
                //Convertir a stringify la talla seleccionada
                body: JSON.stringify({ talla: selectedSize[_id] }),
                headers: {
                    "Content-type": "application/json"
                },
                signal: controller.signal
            }

            //Llamada a la API con las opciones definidas arriba previamente, pasandole el id
            await fetch(`${VITE_URL_API}wishlist/${_id}`, options)

            // Despues de actualizar la talla, se actualiza la wishlist para reflejar los cambios
            await cargarWishlist()

            //Se cierra el pop up
            showPopUp(_id)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        /**
         * Este contexto se utiliza para gestionar la página de wishlist y eliminar o actualizar x prenda de la wishlist
         * @WishlistContext
         * @logoHandler {Function} Botón para acceder a la página principal {/gestor}
         * @wishlistHandler {Function} Botón para acceder a la página de wishlist {/wishlist}
         * @wishlist  del useSate, para pintar las prendas guardadas en la wishlist
         * @eliminarPrendaWishlist {Function} Botón para eliminar prenda de la wishlist
         * @showPopUp {Function} Visualizar el popup de actualizar la talla
         * @popUpVisibility Visibilidad del popup
         * @selectedSize Talla seleccionada
         * @updateSelectedSize {Function} Funcion para actualizar la talla de la prenda desde la Wishlist
         * @handleUpdateTalle {Function} Funcion para actualizar la talla, boton de actualizar
        */

        <WishlistContext.Provider value={{ logoHandler, wishlistHandler, wishlist, eliminarPrendaWishlist, showPopUp, popUpVisibility, selectedSize, updateSelectedSize, handleUpdateTalle }}>
            <Header />
            <Articulos eliminarPrendaWishlist={eliminarPrendaWishlist} />

        </WishlistContext.Provider>
    )
}

/**
 * Componente Header
 * Descripción: Este componente carga el Header de la página de {/wishlist}
 * Estructura: 
 *  - Header
 *      - Sección donde introducimos el logo en este caso color negro y el botón de wishlist que  redirige al apartado wishlist (/wishlist) 
 */
const Header = () => {
    /**
    * Este contexto hace referencia a WishlistContext
    */
    const { logoHandler, wishlistHandler } = useContext(WishlistContext)

    return (
        <header className='Header Header-wishlistgeneral'>
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
 * Descripción: Este componente carga las prendas en la wishlist
 * Estructura: 
 *  - Main
 *      - Contenedor general
 *          - Contenedor de las prendas
 *              - Map de las prendas
 *                  - Componente Prenda
 */
const Articulos = ({ eliminarPrendaWishlist }) => {
    /**
    * Este contexto hace referencia a WishlistContext
    */
    const { wishlist } = useContext(WishlistContext)
    return (
        <main className='Main'>
            <div className='Prendas'>
                <div className='Prendas-container'>
                    {wishlist.map((eachPrenda) => (
                        <Prenda
                            key={eachPrenda._id}
                            {...eachPrenda}
                            //Eliminar prenda de la wishlist
                            eliminarPrendaWishlist={eliminarPrendaWishlist}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}

/**
 * Componente Prenda
 * Descripción: Este componente contiene la estructura de la prenda, asi como los botones de eliminar y actualizar y el popup de actualizar talla
 * Estructura: 
 *  - Contenedor prenda
 *      - Pop up de actualizar
 *          - Contenedor de cerrar
 *              - Titulo talla
 *              - Cerrar X
 *          - Contenedor de tallas
 *              - Texto talla S
 *              - Texto talla M
 *              - Texto talla L
 *          - Boton actualizar
 *      - Contenedor botones actualizar y eliminar 
 *          - Actualizar
 *          - Eliminar
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
    //Propiedades que vienen de la API
    const { _id, src, alt, prendaName, prendaPriceActual, prendaPriceDisccount, prendaPriceLast, prendaPriceOld, talla, eliminarPrendaWishlist } = props

    /**
    * Este contexto hace referencia a WishlistContext
    */
    const { popUpVisibility, showPopUp, selectedSize, updateSelectedSize, handleUpdateTalle } = useContext(WishlistContext)
    return (

        <div className='Prenda Prenda-wishlist'>
            {/* Pop up de actualizacion de talla */}
            <div className={`PopUp-wishlist-update ${popUpVisibility[_id] ? "isVisible" : ""}`}>
                <div className='PopUp-wishlist-update-title'>
                    <p>Talla</p>
                    {/* Se cierra el pop up */}
                    <p onClick={() => showPopUp(_id)}>X</p>
                </div>
                <div className='PopUp-wishlist-update-container'>
                    {/* Selected hace referecnia a la talla seleccionada actualmente, y al hacer click se pinta esa talla */}
                    <p className={`PopUp-wishlist-update-talla ${selectedSize[_id] === 'S' ? 'selected' : ''}`} onClick={() => updateSelectedSize(_id, 'S')}>S</p>
                    <p className={`PopUp-wishlist-update-talla ${selectedSize[_id] === 'M' ? 'selected' : ''}`} onClick={() => updateSelectedSize(_id, 'M')}>M</p>
                    <p className={`PopUp-wishlist-update-talla ${selectedSize[_id] === 'L' ? 'selected' : ''}`} onClick={() => updateSelectedSize(_id, 'L')}>L</p>
                </div>
                {/* Boton que cuando se hace click actualiza la talla tanto en la bbdd como visualmente */}
                <button className='PopUp-wishlist-update-button' onClick={() => handleUpdateTalle(_id)}>Actualizar</button>
            </div>

            <div className='Prenda-icons'> 
                {/* Llamada a la funcion para actualizar la prenda desde la Wishlist  */}
                    <img src="/icon-update.svg" alt="Wishlist" className='Prenda-icon Prenda-icon-wishlist' onClick={() => showPopUp(_id)} />
                {/* Llamada a la funcion para eliminar la prenda desde la Wishlist  */}
                    <img src="/icon-delete.svg" alt="Wishlist" className='Prenda-icon Prenda-icon-wishlist' onClick={() => eliminarPrendaWishlist(_id)} />
            </div>
            <img src={src} alt={alt} className='Prenda-img' />
            <div className='Prenda-info'>
                <div className='Prenda-text'>
                    <p className='Prenda-name'>{prendaName}</p>
                </div>
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