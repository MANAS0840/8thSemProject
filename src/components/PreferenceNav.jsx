import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from "react-icons/ai";
import SettingsModal from "./SettingsModal";
import Select from "react-select";
import { background } from "@chakra-ui/react";
import { color } from "framer-motion";
import EditorFooter from "./EditorFooter";
const SelectBars = styled.div`
  display: flex;
  align-items: center;

  flex-wrap: wrap;
  gap: 1rem;

  & > div {
    width: 8rem;
  }

  & > div:last-child {
    width: 10rem;
  }
`;

const PreferenceNav = ({
  runCode,
  submitCode,
  currentLanguage,
  setCurrentLanguage,
  setSettings,
  settings,
  setisres,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    }
  }, [isFullScreen]);

  const languageOptions = [
    { value: "cpp", label: "C++" },
    { value: "javascript", label: "Javascript" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
  ];
  const [language, setLanguage] = useState(() => {
    for (let i = 0; i < languageOptions.length; i++) {
      if (languageOptions[i].value === currentLanguage) {
        return languageOptions[i];
      }
    }
    return languageOptions[0];
  });

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
    setCurrentLanguage(selectedOption.value);
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "my-dark", // Change to your desired background color
      color: "white", // Text color inside the select box
      borderColor: "gray-600", // Border color to match the background
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white", // Text color for the selected value
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(0, 0, 0, 0.253)", // Change to your desired background color
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: "rgba(0, 0, 0, 0.253)", // Ensure the dropdown menu matches the background
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "blue" : "gray-600", // Background color for options
      color: "white", // Text color for options
    }),
  };

  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full ">
      <div className="flex items-center">
        <button className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 hover:bg-dark-fill-2  px-2 py-1.5 font-medium">
          <div className="flex items-center px-1">
            <div className="text-sm  text-white ">
              <SelectBars>
                <Select
                  styles={customStyles}
                  options={languageOptions}
                  value={language}
                  onChange={handleLanguageChange}
                />
              </SelectBars>
            </div>
          </div>
        </button>
      </div>
      <EditorFooter handleRun={runCode} handleSubmit={submitCode} />
      <div className="flex items-center m-2">
        <button
          className="preferenceBtn group"
          onClick={() =>
            setSettings({ ...settings, settingsModalIsOpen: true })
          }
        >
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="preferenceBtn-tooltip">Settings</div>
        </button>

        <button className="preferenceBtn group" onClick={handleFullScreen}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {!isFullScreen ? (
              <AiOutlineFullscreen />
            ) : (
              <AiOutlineFullscreenExit />
            )}
          </div>
          <div className="preferenceBtn-tooltip">Full Screen</div>
        </button>
      </div>
      {settings.settingsModalIsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
};
export default PreferenceNav;
