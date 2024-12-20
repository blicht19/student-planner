import { useGetSubjects, useNavigateToLogin } from '../../../hooks';
import { useEffect, useMemo } from 'react';
import { Dropdown } from '../../dropdown';
import { handleQueryError } from '../../../utils';
import { BarLoader } from 'react-spinners';
import styles from './subject-input.module.css';

/**
 * Dropdown menu for selecting from the subjects that the user has created
 * @param {Object} props props
 * @param props.subject The currently selected subject
 * @param {function} props.setSubject Function for setting the selected subject
 * @returns {JSX.Element}
 */
export const SubjectInput = props => {
  const { subject, setSubject } = props;
  const { data, error, isLoading, isError } = useGetSubjects();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    if (isError && error) {
      handleQueryError(error, navigateToLogin, 'Failed to retrieve subjects');
    }
  }, [error, isError, navigateToLogin]);

  const options = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }
    return data.map(retrievedSubject => {
      return {
        value: retrievedSubject.id,
        label: retrievedSubject.name,
      };
    });
  }, [data, isError, isLoading]);

  return (
    <>
      {!isLoading && (
        <Dropdown
          label='Subject'
          selectedItem={subject}
          options={options}
          onChange={setSubject}
        />
      )}
      {isLoading && (
        <div className={styles.subjectInputLoader}>
          <BarLoader color='var(--medium-light-color)' />
        </div>
      )}
    </>
  );
};
