import loginImg from "../Images/heros.png";
import Template from "../components/Template";

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Build Code for today, tomorrow, and beyond."
      description2="Planning to save your code."
      image={loginImg}
      formType="login"
    />
  );
}

export default Login;
