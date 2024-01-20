import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from "react"
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'

const WishlistContext = createContext()

export const Wishlist = () => {
    const { VITE_URL_API } = import.meta.env

    const navigate = useNavigate()
    
    const logoHandler = () => navigate('/gestor')
    const wishlistHandler = () => navigate('/wishlist')

    //UseState para almacenar la Wishlist
    const [wishlist, setWishlist] = useState([])
    //Nuevo estado para controlar la visibilidad del pop-up para cada elemento
    const [popUpVisibility, setPopUpVisibility] = useState({})
    // 
    const [selectedSize, setSelectedSize] = useState({})

    //Funcion para mostrar el pop up especifico al hacer clic en la imagen
    //CHATGPT!!!!!!!!!!!
    const showPopUp = async (_id, initialSize) => {
        await cargarWishlist()

        setPopUpVisibility((prevVisibility) => ({
            ...prevVisibility,
            [_id]: !prevVisibility[_id]
        }))

        // Si se proporciona una talla inicial usala, de lo contrario, utiliza la talla actualizada
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
    // const showPopUp = () => {
    //     console.log('Mostrar pop up')
    //     setIsPopUpVisible(true);
    // }


    // Para que la wishlist cargue al renderizar el componente y no haya que recargar la pagina cada vez
    const cargarWishlist = async () => {
        let controller = new AbortController()

        let options = {
            method: 'get',
            headers: {
                "Content-type": "application/json"
            },
            signal: controller.signal
        }

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

    useEffect(() => {
        // Si no se ha iniciado la sesión, redirige a login
        if (!localStorage.getItem('usuarios')) {
            navigate('/')
        } else {
            //Si los datos de inicio de sesión existen entonces navega a la wishlist
            navigate('/wishlist')
        }
        cargarWishlist() //Cargar la wishlist al renderizar el componente
    }, [])


    //  funcion para eliminar la prenda desde la Wishlist


    const eliminarPrendaWishlist = async (id) => {
        try {
            let controller = new AbortController()

            let options = {
                method: 'delete',
                headers: {
                    "Content-type": "application/json"
                },
                signal: controller.signal
            }

            await fetch(`${VITE_URL_API}wishlist/${id}`, options)
            // const deleteWishlist = wishlist.filter((prenda) => prenda.id !== id)
            cargarWishlist() //Despues de elimnar la prenda, cargar de nuevo la wishlist
        } catch (error) {
            console.log(error)
        }
    }

    const updateSelectedSize = (_id, size) => {
        setSelectedSize((prevSizes) => ({
            ...prevSizes,
            [_id]: size
        }))
    }

    const handleUpdateTalle = async (_id) => {
        try {
            let controller = new AbortController()

            let options = {
                method: 'put',
                body: JSON.stringify({ talla: selectedSize[_id] }),
                headers: {
                    "Content-type": "application/json"
                },
                signal: controller.signal
            }

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
        <WishlistContext.Provider value={{ logoHandler, wishlistHandler, wishlist, eliminarPrendaWishlist, showPopUp, popUpVisibility, selectedSize, updateSelectedSize, handleUpdateTalle }}>
            <Header />
            <Articulos eliminarPrendaWishlist={eliminarPrendaWishlist} />

        </WishlistContext.Provider>
    )
}

const Header = () => {
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

const Articulos = ({ eliminarPrendaWishlist }) => {
    const { wishlist } = useContext(WishlistContext)
    return (
        <main className='Main'>
            <div className='Prendas'>
                <div className='Prendas-container'>
                    {wishlist.map((eachPrenda) => (
                        <Prenda
                            key={eachPrenda._id}
                            {...eachPrenda}
                            eliminarPrendaWishlist={eliminarPrendaWishlist}
                        />
                    ))}


                </div>
            </div>
        </main>
    )
}

const Prenda = (props) => {
    const { _id, src, alt, prendaName, prendaPriceActual, prendaPriceDisccount, prendaPriceLast, prendaPriceOld, talla, eliminarPrendaWishlist } = props

    const { popUpVisibility, showPopUp, selectedSize, updateSelectedSize, handleUpdateTalle } = useContext(WishlistContext)
    return (

        <div className='Prenda Prenda-wishlist'>

            <div className={`PopUp-wishlist-update ${popUpVisibility[_id] ? "isVisible" : ""}`}>
                <div className='PopUp-wishlist-update-title'>
                    <p>Talla</p>
                    <p onClick={() => showPopUp(_id)}>X</p>
                </div>
                <div className='PopUp-wishlist-update-container'>
                    <p className={`PopUp-wishlist-update-talla ${selectedSize[_id] === 'S' ? 'selected' : ''}`} onClick={() => updateSelectedSize(_id, 'S')}>S</p>
                    <p className={`PopUp-wishlist-update-talla ${selectedSize[_id] === 'M' ? 'selected' : ''}`} onClick={() => updateSelectedSize(_id, 'M')}>M</p>
                    <p className={`PopUp-wishlist-update-talla ${selectedSize[_id] === 'L' ? 'selected' : ''}`} onClick={() => updateSelectedSize(_id, 'L')}>L</p>
                </div>
                <button className='PopUp-wishlist-update-button' onClick={() => handleUpdateTalle(_id)}>Actualizar</button>
            </div>

            <div className='Prenda-icons'>
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