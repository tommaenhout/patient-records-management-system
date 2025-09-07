const Web = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    className="text-gray-400"
    {...props}
  >
    <path
      d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z"
      fill="currentColor"
    />
    <path
      d="M8 1a7 7 0 0 0-7 7h1.5a5.5 5.5 0 0 1 11 0H15a7 7 0 0 0-7-7z"
      fill="currentColor"
    />
  </svg>
);
export default Web;
