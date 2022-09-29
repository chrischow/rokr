import { useState } from 'react';
import { useKeyResults } from '../shared/hooks/useKeyResults';
import { useObjectives } from '../shared/hooks/useObjectives';
import { useUpdates } from '../shared/hooks/useUpdates';
import { getDate } from '../shared/utils/dates';
import { Objective, KeyResult, Update, TeamInfo } from '../shared/types';
import TimelineCard from './TimelineCard';
import TimelineFilter from './TimelineFilter';
import { config } from '../config';

import './styles.css';

export default function Timeline2() {
  // Get data
  const objectives = useObjectives();
  const keyResults = useKeyResults();
  const updates = useUpdates();

  // Filter state
  const [filterState, setFilterState] = useState({
    freq: { monthly: true, quarterly: true, annual: true },
    teams: Object.fromEntries(config.teams.map((team: TeamInfo) => {
      return [team.teamName, true];
    })),
    keywords: {
      keywords: '',
      objective: true,
      keyResult: true,
      update: true
    },
    time: {
      historical: true,
      forecasted: false
    }
  });

  // Page state
  const [pageNo, setPageNo] = useState(10);
  // Prepare table data
  const tableData = (objectives.isSuccess && keyResults.isSuccess && updates.isSuccess) ?
    updates.data
      .filter((update: Update) => {
        if (!filterState.time.forecasted && !filterState.time.historical) {
          return true;
        } else {
          const today = new Date();
          const updateDate = new Date(update.updateDate);
          if (filterState.time.forecasted && !filterState.time.historical) {
            return updateDate > today;
          } else if (!filterState.time.forecasted && filterState.time.historical) {
            return updateDate <= today;
          } else {
            return true;
          }
        }
      })
      .map((update: Update) => {
        // Get key result
        const kr = keyResults.data.find((keyResult: KeyResult) => keyResult.Id === update.parentKrId);

        // Get objective
        const obj = objectives.data.find((objective: Objective) => objective.Id === kr.parentObjective.Id);

        return {
          ...update,
          krTitle: kr.Title,
          objectiveTitle: obj.Title,
          freq: obj.frequency,
          updateDate: getDate(update.updateDate)
        };
      }).filter((update: any) => {
        let allow: boolean;
        // Filter frequency
        if (
          (update.freq === 'monthly' && filterState.freq.monthly) ||
          (update.freq === 'quarterly' && filterState.freq.quarterly) ||
          (update.freq === 'annual' && filterState.freq.annual)
        ) {
          allow = true;
        } else {
          allow = false;
        }
        // Filter teams
        config.teams.forEach((team: TeamInfo) => {
          if (update.team === team.teamName && !filterState.teams[team.teamName as keyof typeof filterState.teams]) {
            allow = allow && false;
          }
        });
        // Filter keywords
        if (
          filterState.keywords.keywords === '' ||
          (!filterState.keywords.objective && !filterState.keywords.keyResult && !filterState.keywords.update)
        ) {
          allow = allow && true;
        } else if (
          (filterState.keywords.objective && update.objectiveTitle.toLowerCase().includes(filterState.keywords.keywords.toLowerCase())) || //OR is wrong
          (filterState.keywords.keyResult && update.krTitle.toLowerCase().includes(filterState.keywords.keywords.toLowerCase())) ||
          (filterState.keywords.update && update.updateText.toLowerCase().includes(filterState.keywords.keywords.toLowerCase()))
        ) {
          allow = allow && true;
        } else {
          allow = allow && false;
        }

        return allow;
      }).sort((a: any, b: any) => {
        const aDate = new Date(a.updateDate);
        const bDate = new Date(b.updateDate);
        if (aDate < bDate) {
          return 1;
        } else if (aDate > bDate) {
          return -1;
        } else if (a.updateText < b.updateText) {
          return -1;
        } else {
          return 1;
        }
      }).slice(0, pageNo) : null;

  return (
    <>
      <h1 className="mb-2">Updates Timeline</h1>
      <TimelineFilter filterState={filterState} setFilterState={setFilterState} setPageNo={setPageNo} />
      <div className="mt-3">
        {objectives.isSuccess && keyResults.isSuccess && updates.isSuccess && updates.data.length > 0 &&
          <>
            <div className="timeline-card--row">
              {tableData.map((item: any) => {
                return (
                  <div className="timeline-card--card-outer">
                    <TimelineCard key={item.Id} {...item} />
                  </div>
                );
              })}
            </div>
            {tableData.length === pageNo &&
              <div className="text-center mt-4">
                <button className="btn btn-okr-toggle" onClick={() => {
                  setPageNo((prevData: number) => prevData + 10);
                }}>
                  Load More
                </button>
              </div>
            }
          </>
        }
        {(!objectives.isSuccess || !keyResults.isSuccess || !updates.isSuccess || updates.data.length === 0) &&
          <span className="no-data">No data to display.</span>
        }
      </div>
    </>
  )
}