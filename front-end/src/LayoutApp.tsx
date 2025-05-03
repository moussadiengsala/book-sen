import { Outlet } from "react-router"


export default function LayoutApp() {
    return (
        <div className="flex justify-center min-h-screen max-w-full h-full">
            <div className="w-full max-w-7xl">
                <Outlet />
            </div>
        </div>
    )
}
