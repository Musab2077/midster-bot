import React, { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import axios from "axios";
import { IoIosArrowRoundUp } from "react-icons/io";

const Responses = ({ onSendMessage, handleTextArea, children }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "60px";
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (handleTextArea) {
      handleTextArea(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  // useEffect(()=>{
  //   handleSubmit()
  // },[children])

  return (
    <div className="h-screen flex flex-col">
      {/* Bot and Human messages */}
      <div className="overflow-auto flex-1 px-10">
        <div className="mb-14 p-4">{children}</div>
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 left-0 right-0 bg-background pt-2 mx-10 pb-4">
        <div className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                placeholder="Message MidsterBot"
                className="w-full p-4 pt-5 pr-12 rounded-2xl bg-inputBg text-white focus:outline-none resize-none"
                style={{ minHeight: "60px" }}
              />
              <button
                type="submit"
                className="absolute right-2 bottom-2 pb-2 pr-4 text-black hover:opacity-55 transition-opacity"
                disabled={!message.trim()}
              >
                <IoIosArrowRoundUp className="bg-white rounded-full size-8" />
              </button>
            </div>
          </form>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Responses;

export function ResponseItems({ humanMsg, botMsg, item }) {
  return (
    <>
      <div key={item} className="place-items-end overflow-hidden">
        <div className="lg:max-w-md my-5 sm:max-w-sm max-w-52">
          <div
            className={`${
              humanMsg && "bg-hoveringIcon"
            } rounded-xl px-5 py-2.5`}
          >
            <p>{humanMsg}</p>
          </div>
        </div>
      </div>
      <p>{botMsg}</p>
    </>
  );
}
