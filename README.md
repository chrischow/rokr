# ROKR
RDO's solution for the AF's OKR management application.

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
  Dataset ||--|{ Table : contains
  Table ||--|{ Column : contains
  Business-Term ||--|{ Column : "tagged to"
  Dataset {
    int Id PK
    string Title
    string useCases
    string owner
    string pointOfContact
    string dataDomain
  }
  Table {
    int Id PK
    string Title
    string tableDescription
    string updateFrequency
    int parentDataset FK "Dataset"
    string site
    string guid0
  }
  Column {
    int Id PK
    string Title
    string columnDescription
    string dataType
    string businessRules
    int parentTable FK "Table"
    bool isPrimaryKey
    bool isForeignKey
    string codeTable "SharePoint GUID of code table"
    string relatedFactTable "SharePoint GUID of fact table"
    string businessTerm FK "Multi-valued lookup to business terms"
  }
  Business-Term {
    int Id PK
    string Title
    string definition
    string businessRules
    string Source
  }
```