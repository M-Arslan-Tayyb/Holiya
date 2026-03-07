import React from "react";

interface LoaderProps {
    size?: "small" | "default" | "large";
}

export function Loader({ size = "default" }: LoaderProps): React.ReactElement {
    return (
        <div className={`loader loader--${size}`}>
            <div className="loader_cube loader_cube--glowing" />
            <div className="loader_cube loader_cube--color" />
        </div>
    );
}