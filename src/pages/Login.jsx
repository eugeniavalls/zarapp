import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef } from "react"
import '/src/styles/Login.css'
import '/src/styles/Header.css'

const LoginContext = createContext()

export const Login = () => {

    const { VITE_URL_API } = import.meta.env

    const navigate = useNavigate()
    const nombre = useRef('')
    const pass = useRef('')

    // Si ya he iniciado sesión me redirige automaticamente al gestor
    useEffect(() => {
        if (localStorage.getItem('usuarios')) {
            navigate('/gestor')
        }
    })

    const formHandler = (e) => {
        e.preventDefault()

        let nuevo = {
            nombre: nombre.current.value,
            pass: pass.current.value
        }
        console.log(nuevo)

        if (nuevo.nombre && nuevo.pass) {

            let controller = new AbortController()

            //Cambiando siempre a stringify
            let options = {
                method: 'post',
                body: JSON.stringify(nuevo),
                headers: {
                    "Content-type": "application/json"
                },
                signal: controller.signal
            }

            fetch(VITE_URL_API, options)
                .then(res => res.json())
                .then(data => {
                    // console.clear()
                    console.log(data)
                    //Si los datos de inicio de sesión existen entonces navega al gestor
                    if (data) {
                        localStorage.setItem('usuarios', JSON.stringify(data))
                        navigate('/gestor')
                    }
                })
                .catch(error => console.log(error))
                .finally(() => controller.abort())
        }

    }

    return (
        <LoginContext.Provider value={{ formHandler, nombre, pass }}>
            <Header />
            <Form/>
        </LoginContext.Provider>

    )
}

/**
 * Componente Header
 * Descripción: Este componente carga el Header del inicio de sesión
 * Estructura: 
 *  - Header
 *      - Sección donde introducimos el logo y el buscar (que este último no tendrá interacción)
 */
const Header = () => {
    return (

        <header className='Header'>

            <section className='Header-section'>
                <h1 className='Header-h1'>
                    <a href="https://www.zara.com/es/" className='Header-logo'>
                        <img src="/logo.svg" alt="Zara" className='Header-image' />
                    </a>
                </h1>
                <nav className='Header-nav'>
                    <ul className='Header-ul'> BUSCAR </ul>
                </nav>
            </section>
        </header>
    )
}

{/* Cuando se acceda a este formulario se enviará la información a la API y la Api tendrá que comprobar la informacion en la base de datos */}
const Form = (props) => {
    // const { nombre, pass } = props
    const { formHandler, nombre, pass } = useContext(LoginContext)
    return (

        <form onSubmit={formHandler} className='Form' >
            <h2 className='Form-h2'>ACCEDE A TU CUENTA</h2>

            <div className='Form-container'>
                <div className='Form-dates'>
                    <div className='Form-line'>
                        <input type="text" name="nombre" ref={nombre} placeholder="USUARIO" className='Form-info' />
                    </div>
                    <div className='Form-line'>
                        <input type="password" name="pass" ref={pass} placeholder="CONTRASEÑA" className='Form-info' />
                    </div>
                </div>
                <input type="submit" value="INICIAR SESIÓN" className='Form-access' />
            </div>
        </form>
    )
}