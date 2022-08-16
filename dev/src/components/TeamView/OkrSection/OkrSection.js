export default function OkrSection(props) {
  
  // Test
  const objectives = props.objectives.map(obj => {
    return (
      <li key={`obj-${obj.Id}`}>
        {obj.Id} - {obj.Title}
        <ul>
          {props.keyResults
            .filter(kr => kr.parentObjective.Id === obj.Id)
            .map(kr => <li key={`kr-${kr.Id}`}>{kr.Id} - {kr.Title}</li>)}
        </ul>
      </li>
    );
  })
  return (
    <>
      <h3 className="mt-5">Objectives & Key Results</h3>
      <ul>
        {objectives}
      </ul>
    </>
  );
}