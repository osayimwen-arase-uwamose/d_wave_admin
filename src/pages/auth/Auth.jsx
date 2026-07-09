
const Auth = () => { 
  return (
    <div className="bg-primary text-white overflow-x-hidden">
      <div className="absolute inset-0 bg-[url(https://res.cloudinary.com/dslzm3lo6/image/upload/v1774264291/image_xpufb6.jpg)] bg-cover bg-center blur-sm scale-105" />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative min-h-screen flex flex-col items-center justify-center hero-bg p-4 md:p-8">
        <div className="w-full max-w-120 flex flex-col gap-6">
          <div className="flex justify-center mb-2">
            <div
            className="flex items-center gap-2"
            onClick={ 
              console.log("click")
            }
            >
              <div className="text-black rounded-lg">
                <img
                className="w-10"
                src="https://res.cloudinary.com/dslzm3lo6/image/upload/v1771483783/logo_rbnlbh.jpg"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                D-WAV ENT.
              </span>
            </div>
          </div>
          <div className="bg-white glass-card rounded-xl p-6 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-text text-3xl text-text md:text-4xl">
                Admin
              </h1>
              <p className="text-secondary text-sm mt-2">
                Sign in to access your dashboard.
              </p>
            </div>
            <form
            onSubmit={() => console.log("SUBMITTED")}
            className="flex flex-col gap-5"
            >
              <input
              type="username"
              placeholder="username"
              className="h-14 px-4 rounded-lg bg-input border border-input-border placeholder:text-placeholder text-text"
              required
              />
              <input
              type="password"
              placeholder="••••••••"
              className="h-14 px-4 rounded-lg bg-input border border-input-border placeholder:text-placeholder text-text"
              required
              />
              <button
              type="submit"
              disabled={false}
              className="h-14 bg-primary text-white font-bold rounded-lg disabled:opacity-60 cursor-pointer hover:bg-primary-hover"
              onClick={
                console.log("click")
              }>
                Sign In
              </button>
            </form> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;