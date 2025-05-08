import signupImg from "../Images/heros.png";
import Template from "../components/Template";

function Signup() {
  return (
    <Template
      title="Join the Code Master with Us"
      description1=""
      description2=""
      image={signupImg}
      formType="signup"
    />
  );
}

export default Signup;
