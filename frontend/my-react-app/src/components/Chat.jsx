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
import { MdOutlineDelete } from "react-icons/md"; // Delete icon

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
  const [activeChatId, setActiveChatId] = useState(null);
  const [deleteResponse, setDeleteResponse] = useState();
  const [context, setContext] = useState("MidsterBot");

  const { chatIds = 0 } = useParams();

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
        const response = await axios.get(
          `${backendUrl}/loading_chats/${localStorage.getItem("email_id")}`,
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

  function handleSavedChat(id) {
    setActiveChatId(id);
    setChatId(id);
    navigate(`/chat/${id}`);
    setResponses([]);
    setOverlaySideBar(false);

    try {
      axios
        .post(
          `${backendUrl}/accessing_chat`,
          {
            email_id: localStorage.getItem("email_id"),
            chat_id: id,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((output) => {
          if (output.data.exist) {
            const backendRes = output.data.response;
            const newResponses = backendRes.map((e) => ({
              human: e.human,
              bot: e.bot,
            }));
            setResponses(newResponses);
            setChatResponse(true);
            setMessages("");
            setContext(output.data.context);
          } else if (output.data.exist === false) {
            handleNewChat();
          }
        })
        .catch((error) => {});
    } catch {
      console.log("theres an error in the backend");
    }
  }

  function handleNewChat() {
    navigate("/chat/0");
    setMessages("");
    setResponses([]);
    setChatId(0);
    setOverlaySideBar(false);
    setContext("MidsterBot");
    setActiveChatId(null);
  }

  function handleDelete (id) {
    axios.delete(`${backendUrl}/deleting_chat/${id}`)
    .catch((error)=> {
      console.log(error)
    })
    setSideButtons(prev => prev.filter(item => item.chat_id !== 10));
  }

  useEffect(() => {
    if (chatIds > 0) {
      handleSavedChat(chatIds, context);
    } else {
      handleNewChat();
    }
  }, [chatIds]);
  
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
                    onClick={() => navigate("/chat/0")}
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
                  {/* Mobile Sidebar */}
                  {sideButtons &&
                    sideButtons.map((e) => (
                      <div
                        id={e.chat_id}
                        onClick={(e) => navigate(`/chat/${e.target.id}`)}
                        className={`${
                          activeChatId == e.chat_id
                            ? "bg-hoveringIcon"
                            : "hover:bg-hoveringIcon"
                        } my-1 rounded-lg px-2 py-1 cursor-pointer flex justify-between`}
                      >
                        <SideBarSavedChat savedChat={e.context} />
                        <button
                          className="text-red-600 hover:bg-stone-800 rounded-lg p-1"
                          id={e.chat_id}
                          key={e.chat_id}
                          onClick={(k) => {k.stopPropagation(); handleDelete(e.chat_id)}}
                        >
                          <MdOutlineDelete id={e.chat_id} className="size-5" />
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
                      onClick={() => navigate("/chat/0")}
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
                  {/* Desktop Sidebar */}
                  {sideButtons &&
                    sideButtons.map((e, value) => (
                      <div
                        key={value}
                        id={e.chat_id}
                        onClick={(e) => navigate(`/chat/${e.target.id}`)}
                        className={`${
                          activeChatId == e.chat_id
                            ? "bg-hoveringIcon"
                            : "hover:bg-hoveringIcon"
                        } my-1 rounded-lg px-2 py-1 cursor-pointer flex justify-between`}
                      >
                        <SideBarSavedChat savedChat={e.context} />
                        <button
                          className="text-red-600 hover:bg-stone-800 rounded-lg p-1"
                          id={e.chat_id}
                          key={value}
                          onClick={(k) => {k.stopPropagation(); handleDelete(e.chat_id)}}
                        >
                          <MdOutlineDelete id={e.chat_id} className="size-5" />
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
          </Responses>
        </div>
      </div>
    </>
  );
}
