import * as React from "react";
import { useSelector } from "react-redux";
import ErrorPage from "src/pages/_error";
import { authSelectors } from "src/_store";
import AuthContext from "src/components/auth/authContext";

export default function withAuth(Component) {
  const Auth = (props) => {
    const authUser = useSelector(authSelectors.selectUser);

    if (!authUser) return <ErrorPage statusCode={404} />;

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export function withAuthFunction(func) {
  const { isAuthenticated, openLoginBox } = React.useContext(AuthContext);

  return function () {
    if (isAuthenticated) func();
    else openLoginBox();
  };
}
