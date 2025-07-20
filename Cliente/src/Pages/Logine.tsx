import React from "react";
import Styles from "../Styles/Login.module.css";

export function Logine() {
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

          <form>
            <input
              type="text"
              placeholder="Identifiant"
              className={Styles.input}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className={Styles.input}
            />
            <button type="submit" className={Styles.btnConnect}>
              SE CONNECTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
