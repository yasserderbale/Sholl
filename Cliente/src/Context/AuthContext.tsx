import { createContext, useContext,  useEffect,  useState,  type FC, type PropsWithChildren,  } from "react";
    
 interface Matiere {
    name:string,
    prix:number
  }
interface IContext {
    tocken:string | null,
        isAuth:boolean,
        login:(identifinate:string,tocken:string)=>void
        logoute:()=>void,
        mat:any[],
        addMat:(name:string,prix:number)=>void,
        DelatewoneMat:(idMat:any)=>void,
        getOneMat:(idMat:any)=>Promise<Matiere>,
        updateone:(idMat:any,name:string,prix:number)=>void,
        getStudentes:()=>void,
        stude:any

    }
    const Authcontext = createContext<IContext>({
        tocken:null,
    isAuth:false,
    login:()=>{},
    logoute:()=>{},
    mat:[],
    addMat:()=>{},
    DelatewoneMat:()=>{},
    getOneMat:async()=>({  name: "", prix: 0 }),
    updateone:()=>{},
    getStudentes:()=>{},
    stude:[]
    })
    export const AuthProvider:FC<PropsWithChildren> = ({children})=>{
    const [tocken,settocken] = useState<string | null>(localStorage.getItem("Tocken"))
    const [isAuth,setisAuth] = useState(!!tocken)
    const [mat,setmat] = useState<any[]>([])
    const [stude,setstud]=useState<any[]>([])
   
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
           useEffect(()=>{
             const getMat =async ()=>{
                const data = await fetch("http://localhost:3000/Matieres",{
                  headers:{
                    "Authorization":`Bearer ${tocken}`
                  }  
                })
                const response = await data.json()
                if(!response) return    
                setmat(response.data)
                
            }
           getMat()
           },[])
           const addMat  =async (name:string,prix:number)=>{
          if(!name || !prix) {alert("sasir tous les Champs Context")
          return
    }
    const data = await fetch("http://localhost:3000/newMatire",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${tocken}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,prix})
    })
    const response = await data.json()
    if(response.StatusCode!==200) {
      alert(response.data)
       return } 
        setmat((preveMat)=>[...preveMat,response.data])
         alert("ajouter novue matiere")

  }

  const DelatewoneMat = async(idMat:any)=>{
   if(!idMat){alert("Idofmat not provider")
    return 
   }
     const Delete = await fetch(`http://localhost:3000/newMatire/${idMat}`,{
      method:"DELETE",
      headers:{
        "Authorization": `Bearer ${tocken}`,  
      },
    })
    if(!Delete) {
      alert("Delete failed")
      return
    }
    const response = await Delete.json()
    
    console.log(response.data)
  setmat((previesmat)=>previesmat.filter((item)=>item._id!==response.data._id))  
  alert("Delete mat succed")
  }
 
  const getOneMat = async(idMat:any):Promise<Matiere>=>{
    const GetOne = await fetch(`http://localhost:3000/Matieres/${idMat}`,{
      headers:{
        "Authorization":`Bearer ${tocken}`
      }
    })
    const response = await GetOne.json()
    if(!response) {alert("failed get matieres")
          return { name: "", prix: 0 }; // يرجع قيمة فارغة من النوع Matiere

       }
      return response.data as Matiere
  }
  const updateone = async(idMat:any,name:string,prix:number)=>{
    const updateOne =await fetch(`http://localhost:3000/newMatire/${idMat}`,{
      method:"PUT",
      headers:{
        "Authorization":`Bearer ${tocken}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,prix})
    })
    const response = await updateOne.json()
    if(!updateOne.ok) alert(response.data)
  
  console.log(response.data)
  setmat((prev)=>prev.map(m=>m._id===idMat?{...m,name,prix}:m))
  }
  const getStudentes=async()=>{
    const GestStud =await fetch("http://localhost:3000/Student",{
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${tocken}`
      }
    })
    if(!GestStud.ok){
      return
    }
    const response = await GestStud.json()
    if(!response){
      alert(response.data)
    }
    setstud(response.data)
    
  }
  useEffect(()=>{
    getStudentes()
  },[])
    return (
        <Authcontext.Provider value={{login,tocken,isAuth,logoute,mat,addMat,DelatewoneMat,getOneMat,updateone,getStudentes,stude}}>
            {children}
        </Authcontext.Provider>
    )
    }
    export const usAuth = () => useContext(Authcontext)