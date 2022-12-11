import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request.hook";
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { username, email, password },
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
        <h1>Sign Up</h1>
        <div className="form-group my-4">
          <label>Username</label>
          <input
            className="form-control"
            type="text"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          {/* {errorMessage("username")} */}
        </div>

        <div className="form-group my-4">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          {/* {errorMessage("email")} */}
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
        <button className="btn btn-primary my-2">Sign Up</button>
      </form>
    </>
  );
};

export default SignUp;
