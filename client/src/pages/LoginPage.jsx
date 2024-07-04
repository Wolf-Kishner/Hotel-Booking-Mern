import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      //The response has many fields out of which grab data
      const { data } = await axios.post(
        "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUser(data);
      alert("Login Sucessfull");

      setRedirect(true);
    } catch (e) {
      alert("Login Failed");
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto ">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-center">
            <button className="primary">Login</button>
          </div>

          <div className="text-center py-2 text-gray-500">
            Don't have an acoount yet ?
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
