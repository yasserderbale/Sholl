import  { useRef, useState } from "react";
import Styles from "../Styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import { usAuth } from "../Context/AuthContext";
import { Alert, Snackbar } from "@mui/material";
export function Logine() {
  const [Toast,setToast] = useState<{open:boolean,msg:string,type:"success" | "error"}>({open:false,msg:"",type:"success"})
  const {login} = usAuth()
  const navigate =useNavigate()
  let identifianteref  = useRef<HTMLInputElement>(null) 
  let passwordref  = useRef<HTMLInputElement>(null) 
 const hadnlCilck = async(e:any)=>{
  e.preventDefault()
   const identifiante = identifianteref.current?.value || ""
    const password = passwordref.current?.value || ""
    if(!identifiante || !password) {setToast({open:"true",msg:"Saiser Tous Les Shamp",type:"error"})
       return}
    
   const res = await fetch("http://localhost:3000/Login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json" 
    },
    body:JSON.stringify({identifiante,password})
   })
   const data = await res.json()
   if(data.StatusCode==200){
    login(identifiante,data.data)
     identifianteref.current!.value="",
    passwordref.current!.value=""
navigate("/TBoard")
    setToast({open:true,msg:"Bienvenu dans Votre application",type:'success'})

   }
   else {
    setToast({open:true,msg:`${data.data}`,type:'error'})
    navigate("/")
   }
 }

  return (
    <div className={Styles.container}>
      <Snackbar  anchorOrigin={{ vertical: "top", horizontal: "center" }} open={Toast.open} autoHideDuration={4000} onClose={()=>setToast({...Toast,open:false})}>
        <Alert sx={{width:"190px"}} severity={Toast.type}>{Toast.msg}</Alert>
      </Snackbar>
      {/* Left Side */}
      <div className={Styles.leftSide}>
        <h1 className={Styles.logo}>Taj Ilme</h1>
        <h2 className={Styles.subTitle}>Ecodle De Coures et </h2>
        <p className={Styles.slogan}>Votre espace sécurisé et performant</p>
      </div>

      {/* Right Side */}
      <div className={Styles.rightSide}>
        <div className={Styles.formBox}>
          <h2 className={Styles.formTitle}>Bienvenue</h2>
          <p className={Styles.formSubTitle}>
            Connectez-vous à votre tableau de bord
          </p>

          <form onSubmit={hadnlCilck}>
            <input
            ref={identifianteref}
              type="text"
              placeholder="Identifiant"
              className={Styles.input}
            />
            <input
            ref={passwordref}
              type="password"
              placeholder="Mot de passe"
              className={Styles.input}
            />
            <button   type="submit" className={Styles.btnConnect}>
              SE CONNECTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
