import  { useRef } from "react";
import Styles from "../Styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import { usAuth } from "../Context/AuthContext";
export function Logine() {
  const {login} = usAuth()
  const navigate =useNavigate()
  let identifianteref  = useRef<HTMLInputElement>(null) 
  let passwordref  = useRef<HTMLInputElement>(null) 
 const hadnlCilck = async(e:any)=>{
  e.preventDefault()
   const identifiante = identifianteref.current?.value || ""
    const password = passwordref.current?.value || ""
    if(!identifiante || !password) {alert("Saiser Tous Les Shamp")
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
   }
   else {
    alert(data.data)
    navigate("/")
   }
 }

  return (
    <div className={Styles.container}>
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
