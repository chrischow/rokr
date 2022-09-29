import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { config } from "../../config";
import { TeamInfo } from "../../shared/types";

import './styles.css';

export default function TimelineFilter(props: any) {
  // State for offcanvas
  const [showFilters, setShowFilters] = useState(false);
  const [freqFilters, setFreqFilters] = useState({...props.filterState.freq});
  const [teamFilters, setTeamFilters] = useState({...props.filterState.teams});
  const [keywordFilters, setKeywordFilters] = useState({...props.filterState.keywords});
  const [timeFilters, setTimeFilters] = useState({...props.filterState.time});

  // Handle keyword changes
  const entityMap = {
    'Objectives': 'objective',
    'Key Results': 'keyResult',
    'Updates': 'update'
  };
  const handleChange = (event: any) => {
    setKeywordFilters((prevData: any) => {
      return {
        ...prevData,
        keywords: event.target.value
      };
    })
  }
  // Close filters
  const handleClose = () => setShowFilters(false);

  return (
    <>
      <div className="text-end">
        <button className="btn btn-okr-toggle" onClick={() => setShowFilters(true)}>
          Filter
        </button>
      </div>

      <Offcanvas show={showFilters} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Updates</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="container">
            <div className="mt-3">
              <h5>Frequency:</h5>
              <div className="mt-3 text-center">
                {
                  ['monthly', 'quarterly', 'annual'].map((freq: string) => {
                    return <button
                      className={`btn btn-filter-button ${freqFilters[freq as keyof typeof freqFilters] ? 'filter-on' : ''}`}
                      key={`filter-btn-${freq}`}
                      onClick={() => setFreqFilters((prevData: any) => {
                        return {
                          ...prevData,
                          [freq]: !prevData[freq]
                        }
                      })}
                    >
                      {freq}
                    </button>
                  })
                }
              </div>
            </div>
            <div className="mt-4">
              <h5>Time:</h5>
              <div className="mt-3 text-center">
                {
                  ['Historical', 'Forecasted'].map((time: string) => {
                    return <button
                      className={`btn btn-filter-button ${timeFilters[time.toLowerCase() as keyof typeof timeFilters] ? 'filter-on' : ''}`}
                      key={`filter-btn-${time}`}
                      onClick={() => setTimeFilters((prevData: any) => {
                        return {
                          ...prevData,
                          [time.toLowerCase()]: !prevData[time.toLowerCase()]
                        }
                      })}
                    >
                      {time}
                    </button>
                  })
                }
              </div>
            </div>
            <div className="mt-4">
              <h5>Team:</h5>
              <div className="mt-3 text-center">
                {
                  config.teams.map((team: TeamInfo) => {
                    return (
                      <button
                        className={`btn btn-filter-button ${teamFilters[team.teamName as keyof typeof teamFilters] ? 'filter-on' : ''}`}
                        key={`filter-btn-${team.slug}`}
                        onClick={() => setTeamFilters((prevData: any) => {
                          return {
                            ...prevData,
                            [team.teamName]: !prevData[team.teamName]
                          }
                        })}
                      >
                        {team.teamName}
                      </button>
                    );
                  })
                }
              </div>
            </div>
            <div className="mt-4">
              <h5>Keywords:</h5>
              <div className="container mt-3 text-center">
                <input
                  type="text"
                  className="form-dark form-control mt-1 mb-1"
                  name="keywords"
                  value={keywordFilters.keywords}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <span className="text-grey">found in</span>
                <div className="mt-1">
                  {
                    ['Objectives', 'Key Results', 'Updates'].map((entity: string) => {
                      return <button
                        className={`btn btn-filter-button ${keywordFilters[entityMap[entity as keyof typeof entityMap] as keyof typeof keywordFilters] ? 'filter-on' : ''}`}
                        key={`filter-btn-${entityMap[entity as keyof typeof entityMap]}`}
                        onClick={() => setKeywordFilters((prevData: any) => {
                          return {
                            ...prevData,
                            [entityMap[entity as keyof typeof entityMap]]: !prevData[entityMap[entity as keyof typeof entityMap]]
                          }
                        })}
                      >
                        {entity}
                      </button>
                    })
                  }
                </div>
              </div>
            </div>
            <div className="mt-5 mb-5 container">
              <hr />
            </div>
            <div className="text-center">
              <button className="btn btn-green" onClick={() => {
                // Close
                handleClose();
                // Reset page count
                props.setPageNo(10);
                // Push state upward
                props.setFilterState({
                  freq: freqFilters,
                  teams: teamFilters,
                  keywords: keywordFilters,
                  time: timeFilters
                });
              }}>
                Filter Updates
              </button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}