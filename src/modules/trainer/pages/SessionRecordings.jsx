import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { ROLES } from '../../../constants/roles';

// Import both role-specific views from the recordings module
import StudentRecordings from '../../recordings/pages/StudentRecordings';
import TrainerRecordings from '../../recordings/pages/TrainerRecordings';

const SessionRecordings = () => {
  const { userRole } = useAuth();

  // Check if current user is a student
  const isStudent = userRole?.toLowerCase() === ROLES.STUDENT.toLowerCase();

  // Dynamically render Student view or Trainer view
  return isStudent ? <StudentRecordings /> : <TrainerRecordings />;
};

export default SessionRecordings;