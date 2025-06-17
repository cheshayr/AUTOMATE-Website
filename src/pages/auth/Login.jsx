import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import logo from "@/assets/logo.png";
import authenticatedApi, { getAxiosErrorMessage } from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
    data.preventDefault();
    const formData = new FormData(data.target);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      console.error("email and password are required");
      return;
    }

    try {
      const response = await authenticatedApi.post("/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { data, token } = response.data;
        login(data, token);
        alert(`Logged in as ${data.role}`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = getAxiosErrorMessage(error) || "Login failed";
      alert(errorMessage);
    }
  };
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted absolute w-full h-full hidden lg:block -z-10">
        <img
          src="/tierodman.png"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div></div>
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="size-6">
              <img
                src={logo}
                alt="Image"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
            TIERODMAN
          </a>
        </div>
        <div className="flex flex-col flex-1 items-center justify-center">
          <div className="size-40 flex items-center justify-center mb-4">
            <img
              src={logo}
              alt="Image"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
