import Link from "next/link";

const LeftSideContent = () => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 pb-0 sm:pb-0 sm:py-12 lg:py-0">
            {/* Logo */}
            <Link href="/admin" className="block mb-8 sm:mb-12 lg:mb-16 w-full max-w-lg">
                <div className="flex justify-center lg:justify-start items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                        <span className="text-black font-bold text-xl">M</span>
                    </div>
                    <span className="text-lg sm:text-xl font-semibold">AI Short Video Creator</span>
                </div>
            </Link>

            {/* Main Content */}
            <div className="max-w-lg w-full text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                    Admin Dashboard
                </h1>

                <p className="text-gray-400 text-sm sm:text-base lg:text-lg  lg:mb-12 leading-relaxed">
                    Manage users, videos for the AI short video creation platform.
                </p>
            </div>
        </div>
    );
};
export default LeftSideContent;
