import { useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { 
  Eye,
  EyeOff,
  LogIn
} from "lucide-react";

import { toast } from "sonner";

import { 
  Link,
  useNavigate
} from "react-router-dom";

import loginSchema from "../../validation/login.schema.js";

import authService from "../../services/auth.service.js";

import useAuth from "../../hooks/useAuth.js";

import Button from "../../components/ui/Button.jsx";

const LoginForm = () => {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(
      loginSchema
    ),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    credentials
  ) => {
    try {
      const data =
        await authService.login(
          credentials
        );

      login(data);

      toast.success(
        "Welcome back."
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to sign in. Please check your credentials and try again.";

      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >

      {/* Email */}

      <div>
        <label
          htmlFor="email"
          className="
            mb-2
            block
            font-mono
            text-xs
            font-bold
            uppercase
            tracking-widest
          "
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className="
            w-full
            border
            border-border
            bg-surface
            px-4
            py-3
            text-text
            outline-none

            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
          "
        />

        {errors.email && (
          <p
            className="
              mt-2
              text-sm
              text-red-600
            "
          >
            {errors.email.message}
          </p>
        )}
      </div>


      {/* Password */}

      <div>
        <div className="
          mb-2
          flex
          items-center
          justify-between
        ">
          <label
            htmlFor="password"
            className="
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-widest
            "
          >
            Password
          </label>

          <a
            href="/forgot-password"
            className="
              text-xs
              font-medium
              text-text-muted
              hover:text-text
            "
          >
            Forgot password?
          </a>
        </div>

        <div className="relative">

          <input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register("password")}
            className="
              w-full
              border
              border-border
              bg-surface
              px-4
              py-3
              pr-12
              text-text
              outline-none

              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) =>
                  !current
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-text-muted
              transition-colors
              hover:text-text
            "
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>

        {errors.password && (
          <p
            className="
              mt-2
              text-sm
              text-red-600
            "
          >
            {
              errors.password.message
            }
          </p>
        )}
      </div>


      {/* Submit */}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={LogIn}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting
          ? "Signing In..."
          : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;