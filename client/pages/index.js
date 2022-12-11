import axios from "axios";
import buildClient from "../api/build-client.api";
const Home = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

Home.getInitialProps = async (context) => {
  // console.log(req.headers.cookie.split("=")[1]);
  console.log("damn!!");
  const client = buildClient(context);
  let currentUser;

  try {
    const { data } = await client.get("/api/users/currentuser");
    currentUser = data.currentUser;
  } catch (error) {
    currentUser = null;
  }

  return {
    currentUser,
  };
};

export default Home;
