import {useNavigate} from 'react-router-dom'
import { useEffect, useRef } from "react"

export const Login = () => {

    const {VITE_URL_API} = import.meta.env

    const navigate = useNavigate()
    const nombre = useRef('')
    const pass = useRef('')

    //Si ya he iniciado sesión me redirige automaticamente al gestor
    useEffect(()=>{
        if(localStorage.getItem('usuarios')){
            navigate('/gestor')
        } 
    })

    const formHandler = (e) => {
        e.preventDefault()

        let nuevo = {
            nombre : nombre.current.value ,
            pass : pass.current.value 
        }

        //Cambiando siempre a stringify
        let options = {
            method : 'post', 
            body: JSON.stringify(nuevo),
            headers : {
                "Content-type" : "application/json"
            }
        }
        fetch(VITE_URL_API, options) 
        .then(res => res.json())
        .then(data => {
            console.log(data)

            //Si los datos de inicio de sesión existen entonces navega al gestor
            if (data){
                localStorage.setItem('usuarios', JSON.stringify(data))
                navigate('/gestor')
            }
        })
        .catch(error => console.log(error))
    } 

    return (
        <>
            <h2>Login</h2>

            {/* Cuando se acceda a este formulario se enviará la información a la API y la Api tendrá que comprobar la informacion en la base de datos */}
            <form onSubmit={formHandler} >
                <input type="text" name="nombre" ref={nombre}placeholder="user"/>
                <input type="password" name="pass" ref={pass}placeholder="pass"/>
                <input type="submit" value="Acceder" />
            </form>
        </>
    )
}