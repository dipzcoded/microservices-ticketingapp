import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request.hook";
const SignIn = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { uniqueId, password },
    onSuccess: () => Router.push("/"),
  });
  // const [errors, setErrors] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  const errorMessage = (fieldName) => {
    if (errors.length) {
      return errors.map(
        (el) =>
          el.field === fieldName && (
            <div key={el.field} class="alert alert-danger my-2" role="alert">
              {el.message}
            </div>
          )
      );
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className="form-group my-4">
          <label>Username or Email</label>
          <input
            className="form-control"
            type="text"
            name="uniqueId"
            onChange={(e) => setUniqueId(e.target.value)}
            value={uniqueId}
          />
          {/* {errorMessage("username")} */}
        </div>

        <div className="form-group my-4">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {/* {errorMessage("password")} */}
        </div>
        {errors}
        <button className="btn btn-primary my-2">Sign In</button>
      </form>
    </>
  );
};

export default SignIn;
