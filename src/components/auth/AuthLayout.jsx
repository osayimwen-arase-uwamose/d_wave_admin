import Logo from "../layout/Logo";

function AuthLayout({
  children,
}) {
  return (
    <main
      className="
        min-h-screen
        bg-background
        bg-grid

        flex
        items-center
        justify-center

        px-6
        py-12
      "
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
