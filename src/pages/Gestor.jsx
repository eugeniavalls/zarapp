import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef, useState } from "react"
import '/src/styles/Gestor.css'
import '/src/styles/Slider.css'
import '/src/styles/Header.css'
import '/src/styles/Rebajas.css'

const HeaderContext = createContext()

export const Gestor = () => {
    
    const {VITE_URL_API} = import.meta.env

    const navigate = useNavigate()

    const src = useRef('')
    const alt = useRef('')

    //useState para buscar los elmentos 
    const [sliders, setSlider] = useState([])
    const [active, setActive] = useState(0)

    const nextHandler = () => {
        setActive(active + 1)

        if(active >= sliders.length - 1){
            setActive(0)
        }
    }

    const prevHandler = () => {
        setActive (active - 1)
        if (active <= 0){
            setActive(sliders.length - 1)
        }
    }

    const rebajasHandler = () => navigate('/rebajas')
    const logoHandler = () => navigate('/gestor')
    const wishlistHandler = () => navigate('/wishlist')

    useEffect(() => {
        // Si no se ha iniciado la sesión, redirige a login
        if (!localStorage.getItem('usuarios')) {
            navigate('/')
        } else{
            //Si los datos de inicio de sesión existen entonces navega al gestor
            navigate('/gestor')
        }

        // let nuevo = {
        //     src: src.current.value,
        //     alt: alt.current.value
        // }

        let controller = new AbortController()

        let options = {
            method: 'get',
            // body: JSON.stringify(nuevo),
            headers: {
                "Content-type": "application/json"
            },
            signal: controller.signal
        }

        fetch(`${VITE_URL_API}gestor`, options)
            .then(res => res.json())
            .then(data => {
                console.clear()
                console.log(data)
                setSlider(data) 
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())
        
    }, [])



    return (
    
        <HeaderContext.Provider value={{rebajasHandler, logoHandler, wishlistHandler, sliders, active, prevHandler, nextHandler}}>
            <Header />
            <Rebajas/>
            {/* <SliderProvisional/> */}
            <Slider/>

        </HeaderContext.Provider>
    )
}

const Header = () => {
    const {logoHandler, wishlistHandler} = useContext(HeaderContext)

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

const Rebajas = () => {
    const {rebajasHandler} = useContext(HeaderContext)
    return(
        
        <button className='Rebajas-button' onClick={rebajasHandler}>
            REBAJAS 
        </button>
        
    )
}

// const SliderProvisional = () => {
//     return (
//         <main className='Main'>
//                 <div className='Slider'>
//                     <div className='Slider-container' 
//                         // style={{ 
//                         //     width : `${100 * sliders.length}`, 
//                         //     gridTemplateColumns : `repeat ( ${100 / sliders.length}, 1fr)`,
//                         //     transform : `translateX(-${ (100/sliders.length) * active}%)`
//                         // }}
//                     >
//                         <img src="/home.jpg" alt="Imagen 1" className='Slider-img'/>
//                         <img src="/home2.jpg" alt="Imagen 2" className='Slider-img'/>
//                         <img src="/home3.jpg" alt="Imagen 3" className='Slider-img'/>
//                         <img src="/home4.jpg" alt="Imagen 4" className='Slider-img'/>
//                         <img src="/home5.jpg" alt="Imagen 5" className='Slider-img'/>
                        
//                     </div>
//                 </div>

//                 <button className='Slider-next' ><img src="/angle-right-solid.svg" alt="Angle Next"/></button>
//                 <button className='Slider-prev' ><img src="/angle-left-solid.svg" alt="Angle Prev" /></button>
//             </main>
//     )
// }

const Slider = () => {
    const {sliders, active, nextHandler, prevHandler} = useContext(HeaderContext)
    return (
        <main className='Main'>
                <div className='Slider'>
                    <div className='Slider-container' 
                        style={{ 
                            width : `100%`,
                            transform : `translateY(-${ (100/sliders.length) * active}%)`
                        }}
                    >

                        {sliders.length > 0 && 
                            sliders.map((eachSlider, index) => (
                                <img
                                    key={index}
                                    src={eachSlider.src}
                                    alt={eachSlider.alt}
                                    className='Slider-img'
                                />
                            ))
                        }
                    </div>
                </div>

                <button className='Slider-next' onClick={nextHandler}>Next</button>
                <button className='Slider-prev' onClick={prevHandler}>Prev</button>
            </main>
    )
}

