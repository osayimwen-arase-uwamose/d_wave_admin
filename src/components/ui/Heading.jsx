function Heading({
  level = 1,
  children,
  className = "",
}) {
  const Tag = `h${level}`;

  const sizes = {
    1: "text-5xl md:text-7xl",
    2: "text-4xl md:text-5xl",
    3: "text-2xl",
    4: "text-xl",
  };

  return (
    <Tag
      className={`
        font-display
        font-bold
        text-text
        ${sizes[level]}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

export default Heading;
