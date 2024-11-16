const Header = () => {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
                <div className="flex gap-8">
                    <a href="/" className="text-blue-600 hover:text-blue-800">Dashboard</a>
                    <a href="/profile" className="text-blue-600 hover:text-blue-800">Profile</a>
                </div>
            </div>
      </header>
    );
}

export default Header;