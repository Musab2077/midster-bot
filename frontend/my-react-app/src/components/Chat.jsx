import { useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar, { NavBarItem } from "./NavBar";
import SideBar, { SideBarItems, SideBarSavedChat } from "./SideBar";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineBars3 } from "react-icons/hi2";
import Responses, { ResponseItems } from "./Responses";
import "./scrollbar.css";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

export default function Chat(props) {
  const navigate = useNavigate();
  const [mdDevices, setMdDevices] = useState(window.innerWidth > 845);
  const [iconResponse, setIconResponse] = useState(true);
  const [newChat, setNewChat] = useState();
  const [messages, setMessages] = useState("");
  const [responses, setResponses] = useState([]);
  const [chatResponse, setChatResponse] = useState(false);
  const [context, setContext] = useState("MidsterBot");
  const [chatId, setChatId] = useState(0);
  // const [contextResponse, setContextResponse] = useState(true);
  const [chat, setChat] = useState();
  const [overlaySideBar, setOverlaySideBar] = useState(false);
  // const [response, setResponses]

  const backendUrl = "http://127.0.0.1:8000";
  // const emailId = localStorage.getItem("email_id");
  // const token = localStorage.getItem("email_id");

  const handleStorage = () => {
    try {
      const token = localStorage.removeItem("token");
      if (!token) {
        console.log("Token not found in localStorage");
      }
    } catch (err) {
      console.log("Error accessing localStorage:", err);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
    toast.success("Log-Out Successfully");
  };

  const handleNewChat = () => {};

  const handleSideBarOnSmD = () => {};

  // console.log(localStorage.getItem("email_id"))

  const handleSubmit = async (e) => {
    if (messages.trim()) {
      try {
        setResponses((prev) => [...prev, { human: messages, bot: "..." }]);
        const response = await axios.post(`${backendUrl}/bot_responses`, {
          message: messages,
          email_id: localStorage.getItem('email_id'),
          chat_id: chatId,
        });
        setChatResponse(true);
        setResponses((prev) => [
          ...prev.slice(0, -1),
          { human: messages, bot: response.data["response"] },
        ]);
        setContext(response.data["context"]["content"]);
        // setContextResponse(false);
        setMessages("");
      } catch (error) {
        console.error("Error:", error);
        setResponses((prev) => [
          ...prev.slice(0, -1),
          { human: messages, bot: "Error getting response" },
        ]);
        setChatResponse(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextArea = (e) => {
    setMessages(e.target.value);
  };

  useEffect(() => {
    const handleResize = () => {
      setMdDevices(window.innerWidth > 845);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="flex flex-row h-screen bg-mainBg text-white">
        <div>
          {overlaySideBar && (
            <div className=" bg-black bg-opacity-90">
              <SideBar
                designing={
                  "fixed top-0 translate-x-0 bottom-0 flex-shrink-0 z-10"
                }
                iconResponse={true}
              >
                <button
                  id="cross icon"
                  onClick={() => setOverlaySideBar(!overlaySideBar)}
                  className="rounded-md cursor-ew-resize hover:bg-hoveringIcon place-items-center size-8"
                >
                  <SideBarItems expanding={<RxCross2 className="size-5" />} />
                </button>
              </SideBar>
            </div>
          )}
        </div>
        {/* Sidebar */}
        {mdDevices && (
          <>
            <div>
              <SideBar
                scChildren={<SideBarSavedChat />}
                iconResponse={iconResponse}
              >
                <button
                  id="close and expand"
                  className="size-8 place-items-center cursor-ew-resize hover:bg-hoveringIcon rounded-md"
                  onClick={() => setIconResponse(!iconResponse)}
                >
                  <SideBarItems
                    expanding={
                      iconResponse ? (
                        <GoSidebarExpand className="size-5" />
                      ) : (
                        <GoSidebarCollapse className="size-5" />
                      )
                    }
                  />
                </button>
                <SideBarSavedChat />
              </SideBar>
            </div>
          </>
        )}
        <div
          className={`w-full overflow-hidden focus-visible:outline-0 h-full ${
            overlaySideBar && "bg-black opacity-40 cursor-default"
          }`}
        >
          {/* NavBar */}
          <NavBar>
            {!mdDevices && (
              <NavBarItem
                context={context}
                icon={
                  <button
                    id="NavBar"
                    className="hover:bg-hoveringIcon p-2 rounded-xl"
                    onClick={() => setOverlaySideBar(true)}
                  >
                    <HiOutlineBars3 />
                  </button>
                }
              />
            )}
            {mdDevices && (
              <NavBarItem context={context} logOutFuction={handleLogOut} />
            )}
          </NavBar>
          {/* Bot Responses */}
          <Responses
            onSendMessage={handleSubmit}
            handleTextArea={handleTextArea}
          >
            {chatResponse && (
              <div className="max-w-3xl mx-auto">
                {responses.map((value, key) => (
                  <ResponseItems
                    item={key}
                    humanMsg={value.human}
                    botMsg={value.bot}
                  />
                ))}
              </div>
            )}
            {/* <ResponseInput onSendMessage={handleSubmit}   /> */}
          </Responses>
        </div>
      </div>
    </>
  );
}
