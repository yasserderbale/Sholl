    import { createContext, useContext,  useEffect,  useState,  type FC, type PropsWithChildren,  } from "react";
    interface IContext {
    tocken:string | null,
        isAuth:boolean,
        login:(identifinate:string,tocken:string)=>void
        logoute:()=>void
    }
    const Authcontext = createContext<IContext>({
        tocken:null,
    isAuth:false,
    login:()=>{},
    logoute:()=>{}
    })
    export const AuthProvider:FC<PropsWithChildren> = ({children})=>{
    const [tocken,settocken] = useState<string | null>(localStorage.getItem("Tocken"))
    const [isAuth,setisAuth] = useState(!!tocken)
    useEffect(()=>{
        const gettocken  = localStorage.getItem("Tocken")
        settocken(gettocken)
    })
    const login = (identifiante:string,tocken:string)=>{
        localStorage.setItem("Username",identifiante)
        localStorage.setItem("Tocken",tocken)
        settocken(tocken)
        setisAuth(true)
    }
        const logoute = ()=>{
        localStorage.removeItem("Tocken")
        settocken(null)        
        setisAuth(false)
            

        }
    return (
        <Authcontext.Provider value={{login,tocken,isAuth,logoute}}>
            {children}
        </Authcontext.Provider>
    )
    }
    export const usAuth = () => useContext(Authcontext)