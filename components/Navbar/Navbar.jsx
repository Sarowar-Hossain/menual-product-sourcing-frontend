import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md">
            <div className="max-w-7xl mx-auto px-6 md:py-4 py-2 flex flex-col sm:flex-row sm:justify-between items-center">
                {/* Logo */}
                <div className="text-white text-2xl font-bold">
                    <Link href="/">
                        <img src="/logo.png" alt="logo" className=" h-10" />
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="mt-3 sm:mt-0 flex space-x-6">
                    <Link href="/">
                        <p className="text-white hover:text-gray-300 text-lg transition">Home</p>
                    </Link>
                    <Link href="/add-product">
                        <p className="text-white hover:text-gray-300 text-lg transition">Add Product</p>
                    </Link>
                    <Link href="/edit-product">
                        <p className="text-white hover:text-gray-300 text-lg transition">Edit Product</p>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
