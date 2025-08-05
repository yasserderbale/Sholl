import { Navigate } from "react-router-dom"
import { usAuth } from "../Context/AuthContext"
import type { FC, PropsWithChildren } from "react"
export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {

  const { isAuth,tocken } = usAuth();
  console.log(isAuth,tocken)
  return isAuth ? (
    <>
      {children}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};