import { Route, Routes } from "react-router-dom";
import { useEffect, useDispatch, useNavigate, useSelector } from "react";
import Home from "./screens/Home/index";
import Playground from "./screens/Playground";
import Error404 from "./screens/Error404";
import { GlobalStyle } from "./style/global";
import ModalProvider from "./context/ModalContext";
import PlaygroundProvider from "./context/PlaygroundContext";
import { getUserDetails } from "./services/operations/profileAPI";
import PrivateRoute from "./components/PrivateRoute";
import Room from "./pages/Room";
import EditorPage from "./pages/EditorPage";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Problem from "./pages/Problem";
import Workspace from "./pages/Workspace";
import AddProblem from "./pages/AddProblem";
import UpdateProblem from "./pages/UpdateProblem";

function App() {
  return (
    <PlaygroundProvider>
      <ModalProvider>
        {/* <GlobalStyle /> */}
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <PrivateRoute>
                <Problem />
              </PrivateRoute>
            }
          />
          <Route
            path="/playground/:folderId/:playgroundId"
            element={
              <PrivateRoute>
                <Playground />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/addproblem"
            element={
              <PrivateRoute>
                <AddProblem />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/editproblem"
            element={
              <PrivateRoute>
                <UpdateProblem />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:probid/:probt"
            element={
              <PrivateRoute>
                <Workspace />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Error404 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/colab" element={<Room />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </ModalProvider>
    </PlaygroundProvider>
  );
}

export default App;
