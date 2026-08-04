import { useAuth } from '../../../hooks/useAuth';
import { ROLES } from '../../../constants/roles';
import { Loader2 } from 'lucide-react';

// Import both role-specific views from the recordings module
import StudentRecordings from '../../recordings/pages/StudentRecordings';
import TrainerRecordings from '../../recordings/pages/TrainerRecordings';

const SessionRecordings = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
        <span className="text-xs font-medium">Loading session recordings...</span>
      </div>
    );
  }

  // Check if current user is a student
  const isStudent = userRole?.toLowerCase() === ROLES.STUDENT.toLowerCase();

  // Dynamically render Student view or Trainer view
  return isStudent ? <StudentRecordings /> : <TrainerRecordings />;
};

export default SessionRecordings;