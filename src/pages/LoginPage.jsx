import { Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout.jsx";

import LoginForm from "../components/auth/LoginForm.jsx";

import Card from "../components/ui/Card.jsx";

import Heading from "../components/ui/Heading.jsx";

function LoginPage() {
  return (
    <AuthLayout>

      <Card className="p-8">

        <div className="mb-8">

          <Heading
            as="h1"
            className="text-4xl"
          >
            Welcome back.
          </Heading>

          <p
            className="
              mt-3
              text-text-muted
            "
          >
            Sign in to access your
            admin dashboard.
          </p>

        </div>

        <LoginForm />

      </Card>

    </AuthLayout>
  );
};

export default LoginPage;
