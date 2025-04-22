"use client"

import Loader from "@/componets/Loader"
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

interface AppProviderType{
    isLoading: boolean, 

    login: (
        email: string, 
        password: string
    ) => Promise<void>

    register: (
        name: string, 
        phone: string, 
        street: string, 
        zip: string, 
        city: string,
        country: string,
        email: string, 
        password: string, 
        password_confirmation: string,
    ) => Promise<void>
}

const AppContext = createContext<AppProviderType|undefined>(undefined)

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

export const AppProvider = ({
    children
  }: {
    children: React.ReactNode;
  }) =>  { 

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [authToken, setAuthToken] = useState<string|null>(null)
    const router = useRouter()

    useEffect( () => {
        const token = Cookies.get("authToken");

        if(token){
            setAuthToken(token)
        }else{
            router.push("/auth")
        }
    })

    const login = async (email:string, password: string) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email, password
            });

            if(response.data.status){
               Cookies.set("authToken", response.data.access_token, {expires: 7})
               setAuthToken(response.data.access_token)
               toast.success("Login Successful")
               router.push("/dashboard")
            }
        } catch (error) {
            toast.error("Invalid login detail")
            console.log(error)
        }finally {
            setIsLoading(false)
        }
    }

    const register = async (name: string, phone: string, street: string, zip: string, city: string, country:string, email:string, password: string, password_confirmation: string) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name, 
                phone, 
                street, 
                zip, 
                city, 
                country,
                email, 
                password, 
                password_confirmation
            });

            console.log(response)
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <AppContext.Provider value={ {login, register, isLoading} }>
            {isLoading ? <Loader /> : children}
        </AppContext.Provider>
    )

  }

  export const myAppHook = () => {
    const context = useContext(AppContext)

    if(!context) {
        throw new Error("Context will be wrapped inside AppProvider")
    }

    return context;
  }