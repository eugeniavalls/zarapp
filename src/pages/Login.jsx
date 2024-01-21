/**
* Este componente carga el inicio de sesión
*
* @hook {useNavigate} a partir de la función navigate, permite hacer redirecciones
* @hook {createContext} Se crea el contexto
* @hook {useContext} Usamos el contexto para los otros componentes
* @hook {useEffect} Hace una llamada al fetch
* @hook {useRef} Nos permite guardar la referencia a elementos del DOM y acceder a los métodos de la API
*/

import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef } from "react"
import '/src/styles/Login.css'
import '/src/styles/Header.css'

const LoginContext = createContext()

/**
* Este componente hace la llamada a la API para poder realizar el inicio de sesión
*
* @hook {useNavigate} a partir de la función navigate, permite hacer redirecciones
* @hook {useRef} Nos permite guardar la referencia a elementos del DOM y acceder a los métodos de la API, en este caso al nombre y contraseña
* @hook {useEffect} Hace una llamada al fetch
*/
export const Login = () => {
 
    const { VITE_URL_API } = import.meta.env

    //Para hacer redirecciones
    const navigate = useNavigate()

    //Permite guardar referencia y acceder a la API
    const nombre = useRef('')
    const pass = useRef('')

    // Si ya he iniciado sesión me redirige automaticamente al gestor
    useEffect(() => {
        if (localStorage.getItem('usuarios')) {
            navigate('/gestor')
        }
    })

    //Para el botón de acceder al iniciar sesión el usuario
    const formHandler = (e) => {
        e.preventDefault()

        //Props que enviamos procedentes de la API
        let nuevo = {
            nombre: nombre.current.value,
            pass: pass.current.value
        }
        console.log(nuevo)

        //Si el nombre y la contraseña existe en nuestra base de datos entonces navega al gestor
        if (nuevo.nombre && nuevo.pass) {

            let controller = new AbortController()

            //Opciones indicando el método, convertir lo que enviamos a string
            let options = {
                method: 'post',
                //Cambiando siempre a stringify (con el método get no)
                body: JSON.stringify(nuevo),
                headers: {
                    "Content-type": "application/json"
                },
                signal: controller.signal
            }

            //Llamada a la API con las opciones definidas arriba previamente
            fetch(VITE_URL_API, options)
                .then(res => res.json())
                .then(data => {
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
        /**
         * Este contexto se utiliza para gestionar el inicio de sesión de los usuarios
         * @LoginContext
         * @formHandler {Function} Botón para acceder a iniciar sesión
         * @nombre {prop} Propiedad recibida de la API atribuida al nombre de usuario del inicio de sesión
         * @pass {prop} Propiedad recibida de la APi atribuida a la contraseña del inicio de sesión
         */
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

/**
 * Componente Form
 * Descripción: Cuando se acceda a este formulario se enviará la información a la API y la Api tendrá que comprobar la informacion en la base de datos
 * Estructura: 
 *  - Form
 *      - h2 con el nombre de "Accede a tu cuenta"
 *      - Contenedor general del form
 *          - Contenedor de datos
 *              - Contenedor de input
 *                  - Input nombre
 *              - Contenedor de input
 *                  - Input contraseña
 *          - Input de iniciar sesión
 */
const Form = () => {
    /**
    * Este contexto hace referencia a LoginContext
    */
    const { formHandler, nombre, pass } = useContext(LoginContext)
    return (

        //Usando la función formHandler para acceder a la API y si coincide con la bbdd entonces inicia sesión
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