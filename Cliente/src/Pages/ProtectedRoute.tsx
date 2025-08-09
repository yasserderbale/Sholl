import { Navigate } from "react-router-dom"
import { usAuth } from "../Context/AuthContext"
import type { FC, PropsWithChildren } from "react"
export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {

  const { isAuth } = usAuth();
  return isAuth ? (
    <>
      {children}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};