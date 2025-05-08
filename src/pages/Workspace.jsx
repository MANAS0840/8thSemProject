import { useEffect, useState } from "react";
import Split from "react-split";
import ProblemDescription from "../components/ProblemDescription";
import WPlayground from "../components/WPlayground";
import Confetti from "react-confetti";
import useWindowSize from "../hooks/useWindowSize";
import { useParams } from "react-router-dom";
import { problemEndpoints } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Workspace = () => {
  const { probid, probt } = useParams();
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [problem, setProblem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [issubmf, setissubmf] = useState(false);

  useEffect(() => {
    (async () => {
      let result = null;
      try {
        const response = await apiConnector(
          "GET",
          problemEndpoints.PROBLEM_DETAIL_API,
          null,
          {
            probid: probid,
            Authorization: `Bearer ${token}`,
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        result = response.data;
        console.log(result.data);
        setProblem(result.data);
        setLoading(false);
      } catch (error) {
        console.log("Problem_DETAIL_API API ERROR............", error);
        result = error.response.data;
        setLoading(false);
        // toast.error(error.response.data.message);
      }
    })();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className=" bg-dark-layer-2">
      <Split className="split" minSize={0}>
        {
          <ProblemDescription
            setissubmf={setissubmf}
            issubmf={issubmf}
            problem={problem[0]}
            _solved={solved}
          />
        }
        <div className="bg-dark-fill-2">
          {
            <WPlayground
              setissubmf={setissubmf}
              issubmf={issubmf}
              problem={problem[0]}
              setSuccess={setSuccess}
              setSolved={setSolved}
            />
          }
          {success && (
            <Confetti
              gravity={0.3}
              tweenDuration={4000}
              width={width - 1}
              height={height - 1}
            />
          )}
        </div>
      </Split>
    </div>
  );
};
export default Workspace;
