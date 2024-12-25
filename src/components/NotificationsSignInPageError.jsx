/* eslint-disable react/prop-types */
import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material"; // Import MUI components for error message
import credentials from "../data/Cred.js";
import { useDepartment } from "../components/DepartmentContext.jsx"
// Define your theme with dark mode
const darkTheme = createTheme({
  palette: {
    mode: "dark", // This enables dark mode
  },
});

const providers = [{ id: "credentials", name: "Email and password" }];

// SignIn function to validate credentials
// SignIn function to validate credentials
const signIn = async (
  provider,
  formData,
  setIsLoggedIn,
  navigate,
  setErrorMessage,
  setDepartment
) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const email = formData?.get("email");
      const password = formData?.get("password");

      // Find the matching user in the credentials array
      const user = credentials.find(
        (cred) => cred.email === email && cred.password === password
      );
      if (user && user.email.includes("DEAN")) {
        navigate("/chart");
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", true);
        setDepartment("DEAN");
        resolve({
          type: "CredentialsSignin",
          error: null, // No error for successful login
        });
        return;
      }
      if (user) {
        // If a match is found, extract the department from the email
        const department = email?.split("--")[0]?.replace("DEPT-OF-", "");
        setDepartment(department);
        // If the department is successfully extracted, proceed
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", true);
        navigate("/select-department", { state: { dept: department } });
        resolve({
          type: "CredentialsSignin",
          error: null, // No error for successful login
        });
      } else {
        // If no match is found, reject the promise with an error
        setErrorMessage("You are not authorized to access this site."); // Set the error message
        reject({
          type: "CredentialsSignin",
          error: "Invalid credentials.",
        });
      }
    }, 300); // Simulate server delay
  });

  return promise;
};

export default function Login({ setIsLoggedIn }) {
  const { setDepartment } = useDepartment();
  const navigate = useNavigate(); // Use navigate for redirection
  const [errorMessage, setErrorMessage] = React.useState(""); // State to store error message

  React.useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, [setIsLoggedIn]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!JSON.parse(isLoggedIn)) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignIn = (provider, formData) =>
    signIn(provider, formData, (isLoggedIn) => {
      setIsLoggedIn(isLoggedIn);
      localStorage.setItem("isLoggedIn", isLoggedIn);
    }, navigate, setErrorMessage, setDepartment);

  return (
    <ThemeProvider theme={darkTheme}>
      <AppProvider theme={darkTheme}>
        {/* Pass signIn function with required parameters */}
        <SignInPage signIn={handleSignIn} providers={providers} />
        {/* Display error message as Snackbar if credentials don't match */}
        {errorMessage && (
          <Snackbar
            open={!!errorMessage} // Open the Snackbar if there's an error
            autoHideDuration={6000} // Hide after 6 seconds
            onClose={() => setErrorMessage("")} // Clear the error message when Snackbar is closed
          >
            <Alert
              onClose={() => setErrorMessage("")}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
      </AppProvider>
    </ThemeProvider>
  );
}
