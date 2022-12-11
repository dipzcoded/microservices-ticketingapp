import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request.hook";

const signOut = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <></>;
};

export default signOut;
