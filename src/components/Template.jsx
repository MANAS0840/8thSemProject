import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="bg-dark-layer-1 text-white grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
          <div className="mx-auto w-11/12 max-w-[550px] md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] ">
              {title}
            </h1>

            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="">{description1}</span> <br />
              <span className="font-edu-sa font-bold italic ">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative mx-auto w-11/12 max-w-[650px] md:mx-0 hidden md:block ">
            <img
              src={image}
              alt="Students"
              loading="lazy"
              className="absolute  -top-4 right-1 z-10 h-[400px] "
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;
