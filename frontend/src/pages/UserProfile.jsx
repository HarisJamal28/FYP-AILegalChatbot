import usePersistedUserState from "../components/UI/persistedHook";
const UserProfile = () => {
    const [user] = usePersistedUserState("userInfo", null);
    return (
        <div className="h-[80vh] bg-gray-100 flex items-center justify-center">
            <div className="container mx-auto">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center mb-6 w-24 h-24 rounded-full border-4 border-indigo-500">
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">{user.firstname} {user.lastname}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800">About</h3>
                        <p className="text-gray-600 mt-2">
                            {user.about}
                        </p>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800">Details</h3>
                        <ul className="text-gray-600 mt-2">
                            <li><strong>First Name:</strong> {user.firstname}</li>
                            <li><strong>Last Name:</strong> {user.lastname}</li>
                            <li><strong>Email:</strong> {user.email}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;