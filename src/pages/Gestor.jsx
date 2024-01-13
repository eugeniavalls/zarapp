import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from "react"
import '/src/styles/Gestor.css'
import '/src/styles/Slider.css'

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
    
    useEffect(() => {
        // Si no se ha iniciado la sesión, redirige a login
        if (!localStorage.getItem('usuarios')) {
            navigate('/')
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
                // console.log(data)
                // const filtredData = JSON.parse(JSON.stringify(data))
                setSlider(data)

                
            })
            .catch(error => console.log(error))
            .finally(() => controller.abort())
        
    }, [])

    


    return (
        <>
            <Header />
            
        </>
    )
}

const Header = () => {
    return (
        <header className='Header Header-gestor'>
            <section className='Header-section'>
                <h1 className='Header-h1'>
                    <a href="https://www.zara.com/es/" className='Header-logo'>
                        <img src="/logo-yellow.svg" alt="Zara" className='Header-image' />
                    </a>
                </h1>
                <nav className='Header-nav'>
                    <ul className='Header-ul Header-wishlist'> WISHLIST </ul>
                </nav>
            </section>
        </header>
    )
}

const Slider = () => {
    return (
        <main className='Main'>
                {/* absolute */}
                <div className='Slider'>
                    {/* relative */}
                    <div className='Slider-container' 
                        style={{ 
                            width : `${100 * sliders.length}`, 
                            gridTemplateColumns : `repeat ( ${100 / sliders.length}, 1fr)`,
                            transform : `translateX(-${ (100/sliders.length) * active}%)`
                        }}
                    >
                        {/* {sliders.map ( (eachSlider) => 
                            <img 
                                src = {eachSlider.src}
                                alt = {eachSlider.alt}
                                className='Slider-img'
                            />
                        )} */}

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

                <ul className='Slider-points'>
                    {/* {sliders.map ( (eachSlider, index) => 
                        <li key = {eachSlider.id} className='Slider-point'>
                        <button className={`Slider-btn ${active === index ? 'isSelected' : ''}`}></button>
                    </li>
                    )} */}
                    {sliders.length > 0 && 
                        sliders.map((eachSlider, index) => (
                            <li key={index} className='Slider-point'>
                                <button className={`Slider-btn ${active === index ? 'isSelected' : ''}`}></button>
                            </li>
                        ))
                    }
                </ul>
            </main>
    )
}

