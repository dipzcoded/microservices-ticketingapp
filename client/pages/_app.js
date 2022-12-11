import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client.api";
import Header from "../component/Header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  let currentUser;
  let pageProps = {};
  try {
    const { data } = await client.get("/api/users/currentuser");

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    currentUser = data.currentUser;
  } catch (error) {
    currentUser = null;
  }

  return {
    pageProps,
    currentUser,
  };
};

export default AppComponent;
