const Edit = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    className="text-gray-400"
    {...props}
  >
    <path
      d="M12.146 1.854a.5.5 0 0 1 .708 0l1.293 1.293a.5.5 0 0 1 0 .708L13 5l-3-3 1.146-1.146zM11.5 2.5L2 12v3h3l9.5-9.5-3-3z"
      fill="currentColor"
    />
  </svg>
);
export default Edit;
