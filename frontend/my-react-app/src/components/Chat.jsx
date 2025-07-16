import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { HiDotsHorizontal } from "react-icons/hi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

export default function Chat(props) {
  const navigate = useNavigate();

  const [mdDevices, setMdDevices] = useState(window.innerWidth > 845);
  const [iconResponse, setIconResponse] = useState(true);
  const [messages, setMessages] = useState("");
  const [responses, setResponses] = useState([]);
  const [chatResponse, setChatResponse] = useState(false);
  const [chatId, setChatId] = useState(0);
  const [sideButtons, setSideButtons] = useState();
  const [chat, setChat] = useState();
  const [overlaySideBar, setOverlaySideBar] = useState(false);
  const [sideBarIconHover, setSideBarIconHover] = useState("");

  const { chatIds } = useParams();

  const backendUrl = "http://127.0.0.1:8000";

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
    toast.success("log-Out Successfully");
  };

  const handleSubmit = async (e) => {
    if (messages.trim()) {
      try {
        setResponses((prev) => [...prev, { human: messages, bot: "..." }]);
        const response = await axios.post(`${backendUrl}/bot_responses`, {
          message: messages,
          email_id: localStorage.getItem("email_id"),
          chat_id: chatId,
        });
        setChatResponse(true);
        setResponses((prev) => [
          ...prev.slice(0, -1),
          { human: messages, bot: response.data["response"] },
        ]);
        setMessages("");
        navigate(`/chat/${response.data["chat_id"]}`);
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

  useEffect(() => {
    let isMounted = true;

    const loadingChats = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/loading_chats`,
          {
            email_id: localStorage.getItem("email_id"),
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (isMounted) {
          setSideButtons(response.data);
        }
      } catch (error) {
        console.error("Error loading chats:", error);
        if (isMounted) {
          setSideButtons([]);
        }
      }
    };

    loadingChats();

    return () => {
      isMounted = false;
    };
  }, [chatIds]);

  const handleSavedChat = (e) => {
    setChatId(e.target.id);
    navigate(`/chat/${e.target.id}`);
    setResponses([]);
    setOverlaySideBar(false);

    axios
      .post(
        `${backendUrl}/accessing_chat`,
        {
          id: e.target.id,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((output) => {
        const backendRes = output.data;
        const newResponses = backendRes.map((e) => ({
          human: e.human,
          bot: e.bot,
        }));
        setResponses(newResponses);
        setChatResponse(true);
        setMessages("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewChat = () => {
    navigate("/");
    setMessages("");
    setResponses([]);
    setChatId(0);
    setOverlaySideBar(false);
  };

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
                <div className="flex justify-between">
                  <button
                    id="new chat"
                    className="rounded-md hover:bg-hoveringIcon place-items-center size-8"
                    onClick={handleNewChat}
                  >
                    <IoChatboxEllipsesOutline className="size-5" />
                  </button>
                  <button
                    id="cross icon"
                    onClick={() => setOverlaySideBar(!overlaySideBar)}
                    className="rounded-md cursor-ew-resize hover:bg-hoveringIcon place-items-center size-8"
                  >
                    <SideBarItems expanding={<RxCross2 className="size-5" />} />
                  </button>
                </div>
                <div>
                  {sideButtons &&
                    sideButtons.map((e) => (
                      <div
                        id={e.chat_id}
                        onClick={handleSavedChat}
                        className="hover:bg-hoveringIcon my-1 rounded-lg px-2 py-1 cursor-pointer flex justify-between"
                      >
                        <SideBarSavedChat savedChat={e.context} />
                        <button
                          key={e.chat_id}
                          onClick={() => console.log(e.chat_id)}
                        >
                          <HiDotsHorizontal />
                        </button>
                      </div>
                    ))}
                </div>
              </SideBar>
            </div>
          )}
        </div>
        {/* Sidebar */}
        {mdDevices && (
          <>
            <div>
              <SideBar iconResponse={iconResponse}>
                <div className="flex flex-row justify-between">
                  {iconResponse && (
                    <button
                      id="new chat"
                      className="rounded-md hover:bg-hoveringIcon place-items-center size-8"
                      onClick={handleNewChat}
                    >
                      <IoChatboxEllipsesOutline className="size-5" />
                    </button>
                  )}
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
                </div>
                <div>
                  {sideButtons &&
                    sideButtons.map((e, value) => (
                      <div
                        key={value}
                        id={e.chat_id}
                        onClick={handleSavedChat}
                        className="hover:bg-hoveringIcon my-1 rounded-lg px-2 py-1 cursor-pointer flex justify-between"
                      >
                        <SideBarSavedChat savedChat={e.context} />
                        <button
                          key={e.chat_id}
                          onClick={() => console.log(e.chat_id)}
                        >
                          <HiDotsHorizontal />
                        </button>
                      </div>
                    ))}
                </div>
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
            {mdDevices && <NavBarItem logOutFuction={handleLogOut} />}
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
          </Responses>
        </div>
      </div>
    </>
  );
}
