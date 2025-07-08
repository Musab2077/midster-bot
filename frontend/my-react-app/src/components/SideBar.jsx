import React, { useState } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function SideBar({
  children,
  iconResponse,
  designing,
}) {
  const [sideChildren, scChildren] = React.Children.toArray(children);

  const [icon, setIcon] = useState(true);
  const [newChatHover, setNewChatHover] = useState(false);
  const [animation, setAnimation] = useState();

  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate("/");
    setIcon(true);
    setNewChatHover(true);
  };

  const handleOpen = () => {
    setIcon(!icon);
  };

  return (
    <>
      <aside
        className={`${
          iconResponse
            ? `w-64 bg-sidebarBg overflow-y-auto ${designing}`
            : "w-14 bg-mainBg border border-sidebarBg border-r-black"
        } min-h-screen pt-4 px-4`}
      >
        <nav>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              {/* top of sideBar */}
              {iconResponse && (
                <button
                  id="new chat"
                  className="rounded-md hover:bg-hoveringIcon place-items-center size-8"
                  onClick={handleNewChat}
                >
                  <IoChatboxEllipsesOutline className="size-5" />
                </button>
              )}
              {sideChildren}
            </div>
            {/* Saved Chat */}
            {iconResponse && (
              <div className="my-4">
                <span className="opacity-50 pl-2">Chat</span>
                {scChildren}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

export function SideBarItems({ expanding }) {
  return expanding;
}

export function SideBarSavedChat({ savedChat, navigation }) {
  return (
    <div className="hover:bg-hoveringIcon rounded-lg pl-2 py-1">
      <button onClick={navigation}>{savedChat}</button>
    </div>
  );
}
