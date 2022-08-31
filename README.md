# ROKR
RDO's solution for OKR management in RAiD.

<p>
  <img src="https://badges.aleen42.com/src/javascript.svg">
  <img src="https://badges.aleen42.com/src/react.svg">
  <img src="https://badges.aleen42.com/src/react-router.svg">
</p>

## Value Proposition
OKRs are tough to manage without tools, especially on the internal IT environment. We designed an approach (Stack 2.0) to fully leverage internal tools and designed **ROKR** to enable RAiD to implement OKRs.

## Entity-Relationship Diagram

```mermaid
erDiagram
  Objectives ||--|{ KeyResults : has
  KeyResults ||--|{ Updates : has
  Objectives {
    int Id PK
    string Title
    string objectiveDescription
    date objectiveStartDate
    date objectiveEndDate
    string team
    string owner
    enum frequency "annual/quarterly/monthly"
  }
  KeyResults {
    int Id PK
    string Title
    string krDescription
    date krStartDate
    date krEndDate
    int minValue
    int maxValue
    int currentValue
    int parentObjective FK "Objectives"
  }
  Updates {
    int Id PK
    string Title "Unused"
    string updateText
    date updateDate
    int parentKrId FK "Key Results"
  }
```

## Upcoming Features
- [ ] Delete Objective
- [ ] Delete KR
- [ ] Searchable select boxes
- [ ] Graph view