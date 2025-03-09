import React from "react";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/system";

const bounce = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
`;

const Loading: React.FC = () => {
return (
    <Typography
        component="div"
        sx={{
            animation: `${bounce} 1s infinite`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            "&::before": {
                content: '""',
                display: "block",
                width: "100px", // Increased width
                height: "100px", // Increased height
                backgroundImage: 'url("/p_w.svg")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                animation: `${bounce} 1s infinite`,
            },
        }}
    />
);
};

export default Loading;
