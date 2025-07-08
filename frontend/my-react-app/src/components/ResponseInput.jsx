// import React, { useState, useRef, useEffect } from "react";
// import { IoIosArrowRoundUp } from "react-icons/io";

// const ResponseInput = ({ onSendMessage }) => {
//   const [message, setMessage] = useState("");
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${Math.min(
//         textareaRef.current.scrollHeight,
//         200
//       )}px`;
//     }
//   }, [message]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       onSendMessage(message);
//       setMessage("");
//       if (textareaRef.current) {
//         textareaRef.current.style.height = "60px";
//       }
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="">
//         <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
//           <div className="relative">
//             <textarea
//               ref={textareaRef}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Message MidsterBot"
//               className="w-full p-4 pt-5 pr-12 rounded-2xl bg-inputBg text-white focus:outline-none resize-none"
//               style={{ minHeight: "60px" }}
//             />
//             <button
//               type="submit"
//               className="absolute right-2 bottom-2 pb-2 pr-4 text-black hover:opacity-55 transition-opacity"
//               disabled={!message.trim()}
//             >
//               <IoIosArrowRoundUp className="bg-white rounded-full size-8" />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResponseInput;
