import * as React from "react";
import ErrorPage from "src/pages/_error";
import AuthContext from "src/components/auth/authContext";

export default function withAuth(Component, login=false) {
  const Auth = (props) => {
    const { isAuthenticated, openLoginBox } = React.useContext(AuthContext);

    React.useEffect(() => {
      if (!isAuthenticated && login) openLoginBox();
    }, []);

    if (!isAuthenticated) return <ErrorPage statusCode={404} />;

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
