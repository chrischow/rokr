import { useObjectives } from '../../hooks/useObjectives';
import { useKeyResults } from '../../hooks/useKeyResults';
import { useUpdates } from '../../hooks/useUpdates';

export default function TestQueries() {
  // Test data
  const objectives = useObjectives();
  const keyResults = useKeyResults();
  const updates = useUpdates();

  objectives.isSuccess && console.table(objectives.data.slice(0, 5));
  keyResults.isSuccess && console.table(keyResults.data.slice(0, 5));
  updates.isSuccess && console.table(updates.data.slice(0, 5));

  return (
    <h3>Test</h3>
  );
}