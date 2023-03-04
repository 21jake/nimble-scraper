import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //   const match = useMatch;
  const redirectView = (url: string) => () => {
    navigate(`${url}`);
  };

  return { params, location, navigate, redirectView };
};
