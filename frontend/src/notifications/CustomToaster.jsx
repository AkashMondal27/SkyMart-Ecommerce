import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
    return (
        <Toaster
            toastOptions={{
                style: {
                    background: "#1e293b",
                    color: "#fff",
                },

                success: {
                    style: {
                        background: "#16a34a",
                        color: "#fff",
                    },
                },

                error: {
                    style: {
                        background: "#dc2626",
                        color: "#fff",
                    },
                },

                loading: {
                    style: {
                        background: "#2563eb",
                        color: "#fff",
                    },
                },
            }}
        />
    );
};

export default CustomToaster;