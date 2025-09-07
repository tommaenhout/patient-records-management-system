import * as React from "react";
const Close = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="cursor-pointer text-gray-400"
    width={props.width || 16}
    height={props.height || 16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M15 1L1 15" stroke={props.stroke || "black"} strokeWidth={2} />
    <path d="M1 1L15 15" stroke={props.stroke || "black"} strokeWidth={2} />
  </svg>
);
export default Close;