import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      setErrors(null);
      const { data } = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(data);
      }
      return data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger" role="alert">
          <h4></h4>
          <ul className="my-0">
            {error.response.data.errors.map((el) => (
              <li key={el.field}>{el.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
