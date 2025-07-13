import React from "react";
import { useParams } from "react-router-dom";

const Test = () => {
  const { chatIds } = useParams();

  console.log(chatIds);

  return <div className="text-center">User Id : {chatIds}</div>;
};

export default Test;
