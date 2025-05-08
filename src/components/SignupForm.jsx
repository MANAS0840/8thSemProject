import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sendOtp } from "../services/operations/authAPI";
import { setSignupData } from "../slices/authSlice";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // student or instructor
  const [accountType, setAccountType] = useState("Visitor");

  const [passAlert, setPassAlert] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    // if(e.target.name === "password" && e.target.value.length<8) {
    //   setPassAlert("Must be 8");
    // }
  };

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    //const password = {password};
    if (password.length < 8) {
      setPassAlert("Password must be of at least eight characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }
    const signupData = {
      ...formData,
      accountType,
    };

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData));
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate));

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType("Visitor");
  };

  return (
    <div>
      {/* Form */}
      <form
        onSubmit={handleOnSubmit}
        className="flex md:w-full w-[320px] flex-col gap-y-4  mt-2 "
      >
        <div className="flex md:flex-row flex-col md:gap-11 gap-6">
          <label>
            <p className="mb-1 text-[1.2rem] leading-[1.375rem] ">
              First Name <sup className="bg-red">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="form-style text-black bg-[#eaf3fa]  md:w-[220px] w-[310px] p-2 rounded-md"
            />
          </label>
          <label>
            <p className="mb-1 text-[1.2rem] leading-[1.375rem] ">
              Last Name <sup className="text-pink">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="form-style text-black bg-[#eaf3fa]  md:w-[220px] w-[310px] p-2 rounded-md"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[1.2rem] leading-[1.375rem] ">
            Email Address <sup className="text-pink">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="form-style text-black bg-[#eaf3fa]  md:w-[510px] w-[310px] p-2 rounded-md"
          />
        </label>
        <div className="flex md:flex-row flex-col md:gap-x-4 gap-6">
          <label className="relative">
            <p className="mb-1 text-[1.2rem] leading-[1.375rem] ">
              Create Password <sup className="text-pink">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="form-style text-black bg-[#eaf3fa]  md:w-full w-[310px] !pr-10 p-2 rounded-md"
            />

            <p className="text-pink mt-1 ">{passAlert}</p>
          </label>
          <label className="relative">
            <p className="mb-1 text-[1.2rem] leading-[1.375rem] ">
              Confirm Password <sup className="text-pink">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="form-style text-black bg-[#eaf3fa]  md:w-full w-[310px] !pr-10 p-2 rounded-md"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-[#aec2fe] py-[8px] px-[12px] font-medium text-black md:w-[510px] w-[310px]"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
