import { useGetSubjects } from '../../../hooks';
import { useMemo } from 'react';
import { Dropdown } from '../../dropdown';

export const SubjectInput = props => {
  const { subject, setSubject } = props;
  const subjectQuery = useGetSubjects();
  const options = useMemo(() => {
    return subjectQuery?.data?.map(retrievedSubject => {
      return {
        value: retrievedSubject.id,
        label: retrievedSubject.name,
      };
    });
  }, [subjectQuery]);

  return (
    <Dropdown
      label='Subject'
      selectedItem={subject}
      options={options}
      onChange={setSubject}
    />
  );
};
