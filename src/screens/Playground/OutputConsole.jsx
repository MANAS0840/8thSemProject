import React from "react";
import { Console, Header, TextArea } from "./InputConsole";
import { BiExport } from "react-icons/bi";
import { Text } from "@chakra-ui/react";

const OutputConsole = ({ currentOutput }) => {
  console.log(currentOutput);
  const outputText = currentOutput
    ? currentOutput.join("\n")
    : 'Click "Run Code" to see the output here';
  return (
    <Console>
      <Header>
        Output:
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
            outputText
          )}`}
          download="output.txt"
        >
          <BiExport /> Export Output
        </a>
      </Header>
      {/* <TextArea value={currentOutput} disabled /> */}
      <TextArea value={outputText} disabled />
    </Console>
  );
};

export default OutputConsole;
