import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/operations/authAPI";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[1.2rem] leading-[1.375rem] ">
          Email Address <sup className="text-pink">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="form-style text-black bg-[#eaf3fa] w-full p-2 rounded-md"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[1.2rem] leading-[1.375rem] ">
          Password <sup className="text-pink">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="form-style text-black bg-[#eaf3fa] w-full !pr-10 p-2 rounded-md"
        />

        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-sm text-grey">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-[#aec2fe] py-[8px] px-[12px] font-medium text-black"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
