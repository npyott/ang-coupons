import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div> Hello world! </div>,
    },
    {
        path: "/test",
        element: <div> test! </div>,
    },
]);

function App() {
    const [authToken, setAuthToken] = useState<string>();

    useEffect(() => {
        const localAuthToken = localStorage.getItem("authToken");

        if (localAuthToken) {
            setAuthToken(localAuthToken);
        }
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
