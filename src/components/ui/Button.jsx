function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-primary text-on-primary border border-on-background hover:bg-primary/90",

    secondary:
      "bg-surface text-on-surface border border-on-background hover:bg-surface-container-low",

    dark:
      "bg-on-background text-surface border border-on-background hover:bg-primary-fixed hover:text-on-primary-fixed",

    login:
      "bg-primary-container text-on-primary-container border border-on-background hover:bg-primary-container/90",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-4 text-sm",
    lg: "px-10 py-5 text-sm",
  };

  return (
    <button
      className={`
        cursor-pointer
        uppercase
        font-mono
        tracking-wide
        neo-shadow
        transition-all
        duration-75
        inline-flex
        items-center
        justify-center
        gap-2

        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}

      {Icon && <Icon size={18} />}
    </button>
  );
}

export default Button;
