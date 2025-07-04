
import { Navigate } from 'react-router-dom';
import usePersistedUserState from './persistedHook';

const ProtectedRoutes = ({children}) => {
    const [user] = usePersistedUserState("userInfo", null);
    if (!user?.accessToken) {
        return <Navigate to="/login" />
    }
    return children;
};

export default ProtectedRoutes;