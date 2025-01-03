import Home from "./pages/Home/Home";
import { useEffect } from "react";

function App() {
  const isMessenger = () => {
    const userAgent = navigator.userAgent;
    return /FBAN|FBAV|Instagram/.test(userAgent);
  };

  useEffect(() => {
    // If the user is in Messenger, redirect to Google search with your website URL
    if (isMessenger()) {
      const websiteUrl = "https://ready2-print.vercel.app/"; // Your website URL
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        websiteUrl
      )}`;
      window.location.href = googleSearchUrl; // Redirect to Google search with the website URL as a query
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  useEffect(() => {
    document.title = "PDF Editor";
  }, []);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
