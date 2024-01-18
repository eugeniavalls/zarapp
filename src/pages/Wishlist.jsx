import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef, useState } from "react"
import '/src/styles/Gestor.css'
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'
import '/src/styles/Wishlist.css'

const WishlistContext = createContext()

export const Wishlist = () => {
    const { VITE_URL_API } = import.meta.env
    
    const navigate = useNavigate()

    const logoHandler = () => navigate('/gestor')
    const wishlistHandler = () => navigate('/wishlist')

    //UseState para almacenar la Wishlist
    const [wishlist, setWishlist] = useState([])

    useEffect(() => {

        let controller = new AbortController()

        let options = {
            method: 'get',
            headers: {
                "Content-type": "application/json"
            },
            signal: controller.signal
        }

        fetch(`${VITE_URL_API}wishlist`, options)
            .then(res => res.json())
            .then(data => {
                console.clear()
                console.log("Datos de la API", data)
                setWishlist(data)
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())
        
    }, [])

    return (
        <WishlistContext.Provider value={{ logoHandler, wishlistHandler, wishlist }}>
            <Header />
            <Articulos />

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

const Articulos = () => {
    const { wishlist} = useContext(WishlistContext)
    return (
        <main className='Main'>
            <div className='Prendas'>
                <div className='Prendas-container'>
                    {wishlist.map((eachPrenda) => (
                            <Prenda
                                key={eachPrenda.id}
                                {...eachPrenda}
                            />
                        ))}


                </div>
            </div>
        </main>
    )
}

const Prenda = (props) => {
    const { src, alt, prendaName, prendaPriceActual, prendaPriceDisccount, prendaPriceLast, prendaPriceOld } = props
    return (

        <div className='Prenda Prenda-wishlist'>
            <div className='Prenda-icons'>
                <img src="/icon-update.svg" alt="Wishlist" className='Prenda-icon Prenda-icon-wishlist' />
                <img src="/icon-delete.svg" alt="Wishlist" className='Prenda-icon Prenda-icon-wishlist' />
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