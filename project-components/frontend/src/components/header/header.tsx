import { useNavigate } from 'react-router-dom';

export const Header = () => {
   const navigate = useNavigate();
   const headerItems = ['Lobby', 'Game'];
   return (
      <div className='w-full h-12 flex gap-8 items-center justify-center bg-gray-700 text-white '>
         {headerItems.map((item) => (
            <div className='' onClick={() => navigate('/' + item)}>
               item
            </div>
         ))}
      </div>
   );
};
