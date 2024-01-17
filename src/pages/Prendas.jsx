import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef, useState } from "react"
import '/src/styles/Gestor.css'
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'
import '/src/styles/Prendas.css'

const PrendasContext = createContext()

export const Prendas = () => {
    const { VITE_URL_API } = import.meta.env

    const navigate = useNavigate()
    
    const logoHandler = () => navigate('/gestor')
    const wishlistHandler = () => navigate('/wishlist')

    //UseState para buscar los elementos del array de prendas
    const [prendas, setPrendas] = useState([])
    const [wishlist, setWishlist] = useState([])

    const agregarWishlist = async (producto) => {

        let nuevo = {
            src: producto.src, 
            alt: producto.alt, 
            prendaName: producto.prendaName, 
            prendaPriceActual: producto.prendaPriceActual, 
            prendaPriceDisccount: producto.prendaPriceDisccount, 
            prendaPriceLast: producto.prendaPriceLast, 
            prendaPriceOld: producto.prendaPriceOld
        }

        console.log(nuevo)

        setWishlist([...wishlist, nuevo])

        let controller = new AbortController()

        let options = {
            method: 'post',
            body: JSON.stringify(nuevo),
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
        
    }

    useEffect(() => {

        let controller = new AbortController()

        let options = {
            method: 'get',
            // body: JSON.stringify(nuevo),
            headers: {
                "Content-type": "application/json"
            },
            signal: controller.signal
        }

        fetch(`${VITE_URL_API}rebajas`, options)
            .then(res => res.json())
            .then(data => {
                console.clear()
                console.log("Datos de la API", data)
                setPrendas(data)
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())
        
         
    }, [])


    return (
        <PrendasContext.Provider value={{logoHandler, wishlistHandler, prendas, agregarWishlist}}>
            <Header/>
            <Articulos/>
        </PrendasContext.Provider>
    )
}

const Header = () => {
    const {logoHandler, wishlistHandler} = useContext(PrendasContext)

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

const Articulos = () => {
    const {prendas, agregarWishlist} = useContext(PrendasContext)
    return(
        <main className='Main'>
                <div className='Prendas'>
                    <div className='Prendas-container'>
                        {prendas.map((eachPrenda) => (
                            <Prenda
                                key={eachPrenda.id}
                                {...eachPrenda}
                                agregarWishlist={agregarWishlist}
                            />
                        ))}


                    </div>
                </div>
            </main>
    )
}

const Prenda = (props) => {
    const {src, alt, prendaName, prendaPriceActual, prendaPriceDisccount, prendaPriceLast, prendaPriceOld, agregarWishlist} = props
    return(
   
                        <div className='Prenda'>
                            <img src={src} alt={alt} className='Prenda-img'/>
                            <div className='Prenda-info'>
                                <div className='Prenda-text'>
                                    <p className='Prenda-name'>{prendaName}</p>
                                    <img src="/icon-wishlist.svg" alt="Wishlist" className='Prenda-icon' onClick={()=> agregarWishlist(props)}/>
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





