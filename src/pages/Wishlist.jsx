import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef } from "react"
import '/src/styles/Gestor.css'
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'
import '/src/styles/Wishlist.css'

const PrendasContext = createContext()

export const Wishlist = () => {
    const navigate = useNavigate()

    const logoHandler = () => navigate('/gestor')

    return (
        <PrendasContext.Provider value={{ logoHandler }}>
            <Header />
            <Editar/>
            <Articulos/>

        </PrendasContext.Provider>
    )
}

const Header = () => {
    const { logoHandler } = useContext(PrendasContext)

    return (
        <header className='Header Header-wishlistgeneral'>
            <section className='Header-section'>
                <h1 className='Header-h1'>

                    <img src="/logo.svg" alt="Zara" className='Header-image' onClick={logoHandler} />

                </h1>
                <nav className='Header-nav Header-nav-wishlist'>
                    <ul className='Header-ul Header-wishlist'> WISHLIST </ul>
                </nav>
            </section>
        </header>
    )
}

const Editar = () => {
    // const {rebajasHandler} = useContext(HeaderContext)
    return(
        
        <button className='Editar-button'>
            EDITAR 
        </button>
        
    )
}

const Articulos = () => {
    const {  } = useContext(PrendasContext)
    return (
        <main className='Main'>
            <div className='Prendas'>
                <div className='Prendas-container'>
                    <Prenda/>


                </div>
            </div>
        </main>
    )
}

const Prenda = () => {
    // const { src, alt, prendaName, prendaPriceActual, prendaPriceDisccount, prendaPriceLast, prendaPriceOld } = props
    return (

        <div className='Prenda Prenda-wishlist'>
            <img src="/Prendas/prenda1.jpeg" alt="Prenda 1" className='Prenda-img' />
            <div className='Prenda-info'>
                <div className='Prenda-text'>
                    <p className='Prenda-name'>ANORAK ACOLCHADO</p>
                </div>
                <div className='Prenda-price'>
                    <p className='Prenda-price-old'>59,95 EUR</p>
                    <p className='Prenda-price-last'>39,99 EUR</p>
                    <div className='Prenda-price-now'>
                        <p className='Prenda-price-disccount'>-66%</p>
                        <p className='Prenda-price-actual'>19,99 EUR</p>
                    </div>
                </div>
            </div>
        </div>
    )
}