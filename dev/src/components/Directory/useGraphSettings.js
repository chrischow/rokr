export const useGraphSettings = () => {
  const teamLookup = {
    RAiD: 'org-0',
    PAB: 'org-1',
    SWiFT: 'org-2',
    RDO: 'org-3',
    CyDef: 'org-4',
    SES: 'org-5',
  };

  const defaultNodes = [
    { id: 'org-0', label: 'RAiD', title: 'RSAF Agility, Innovation, and Digital', group: 'king', level: 0, margin: 20, mass: 6, chosen: false },
    { id: 'org-1', label: 'PAB', title: 'Plans & Architecting Branch', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
    { id: 'org-2', label: 'SWiFT', title: 'SWiFT', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
    { id: 'org-3', label: 'RDO', title: 'RSAF Data Office', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
    { id: 'org-4', label: 'CyDef', title: 'Cyber Defence Branch', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
    { id: 'org-5', label: 'SES', title: 'Software Engineering Squadron', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
  ];

  const defaultEdges = [
    { from: 'org-0', to: 'org-1' },
    { from: 'org-0', to: 'org-2' },
    { from: 'org-0', to: 'org-3' },
    { from: 'org-0', to: 'org-4' },
    { from: 'org-0', to: 'org-5' },
  ];

  // Styles
  const orgStyle = {
    color: { background: '#000C1D', border: '#8497B0' },
    chosen: {
      node: (values, id, selected, hovering) => {
        // values.color = '#FF5364';
        // values.borderColor = '#ff2C41';
        values.size = 25;
      }
    },
    font: { color: 'white', face: 'Bahnschrift Light', size: 40 },
    shape: 'box'
  };

  const options = {
    height: '450px',
    width: '100%',
    interaction: {
      tooltipDelay: 10
    },
    // layout: {hierarchical: true},
    groups: {
      king: { ...orgStyle, font: { ...orgStyle.font, size: 60 } },
      org: { ...orgStyle },
      objectives: {
        ...orgStyle,
        color: { ...orgStyle.color, background: '#7B73F0', border: '#5a50ec' },
        font: { ...orgStyle.font, size: 25 }
      },
      keyResults: {
        ...orgStyle,
        size: 10,
        shape: 'circle'
      }
    },
    nodes: { shape: 'box', opacity: 0.75 },
    edges: { color: '#8497B0' },
  };

  return { teamLookup, defaultNodes, defaultEdges, options };
}

export const getColours = (currentValue, maxValue) => {
  // Compute score
  let score = Math.floor(currentValue / maxValue * 10) / 10;
  let background, border;
  if (score < 0.4) {
    background = '#FF5364';
    border = '#ff2C41';
  } else if (score < 0.7) {
    background = '#DDCB27';
    border = '#B0A21F';
  } else {
    background = '#27DDCB';
    border = '#1ebfaf';
  }

  return { background, border };
}