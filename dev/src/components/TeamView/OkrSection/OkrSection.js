import OkrCollapse from "../OkrCollapse/OkrCollapse";

export default function OkrSection(props) {

  // Test
  const okrCollapses = props.objectives.map(obj => {
    const keyResults = props.keyResults.filter(kr => kr.parentObjective.Id === obj.Id);
    return (
      <OkrCollapse
        key={`okrcollapse-${obj.Id}`}
        objective={obj}
        keyResults={keyResults}
      />
    );
  })

  return (
    <>
      <h3 className="mt-5">Objectives & Key Results</h3>
      {okrCollapses}
    </>
  );
}