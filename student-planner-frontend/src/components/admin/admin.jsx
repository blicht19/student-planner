import { useGetUsers } from '../../hooks/index.js';

export const Admin = () => {
  const { isLoading, isError, data } = useGetUsers();

  return (
    <div>
      {!isLoading &&
        !isError &&
        data.map((item, index) => (
          <div key={index}>{JSON.stringify(item)}</div>
        ))}
    </div>
  );
};
