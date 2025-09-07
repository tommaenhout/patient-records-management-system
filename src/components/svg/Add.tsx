const Add = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="{2} "
      d="M12 4v16m8-8H4"
    />
  </svg>
);
export default Add;