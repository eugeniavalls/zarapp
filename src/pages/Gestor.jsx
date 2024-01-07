import {useNavigate} from 'react-router-dom'
import { useEffect } from "react"

export const Gestor = () => {

    const navigate = useNavigate()
    
    useEffect(()=>{

        // Si no se ha iniciado la sesión, redirige a login
        if(!localStorage.getItem('usuarios')){
            navigate('/')
        }

    }, [])

    return (
        <>
            <h2> Gestor </h2>
        </>
    )
}