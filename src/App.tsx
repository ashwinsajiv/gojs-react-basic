/*
*  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';
import { RecursiveTreeView} from './components/RecursiveTreeView'
import { DiagramWrapper } from './components/DiagramWrapper';

import './App.css';

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
interface AppState {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
}

class App extends React.Component<{}, AppState> {
  // Maps to store key -> arr index for quick lookups
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;

  constructor(props: object) {
    super(props);
    this.state = {
      nodeDataArray: [
        {
          expanded: true,
          group: "A",
          highlightColorPrimary: "#FF0000",
          highlightColorSecondary: "#FF6666",
          isGroup: true,
          key: "AF",
          label: "F",
          visible: true
        },
        {
          expanded: true,
          group: "AF",
          isGroup: false,
          key: "AFT",
          label: "T",
          visible: true
        },
        {
          expanded: true,
          group: "AF",
          isGroup: true,
          key: "AFA",
          label: "A",
          labelColor: "#FF0000",
          labelColorExpanded: "#00FF00",
          labelExpanded: "A Expanded",
          visible: true
        },
        {
          expanded: true,
          group: "AF",
          isGroup: true,
          key: "AFTr",
          label: "Tr",
          visible: true
        },
        {
          expanded: true,
          group: "AF",
          headingColor: "#999999",
          isGroup: true,
          key: "AFC",
          label: "C",
          visible: true
        },
        {
          expanded: true,
          group: "AF",
          isGroup: true,
          key: "AFE",
          label: "E",
          visible: true
        },
        {
          expanded: true,
          group: "AFA",
          isGroup: false,
          key: "AFAS",
          label: "S",
          visible: true
        },
        {
          expandable: true,
          expanded: true,
          group: "AFTr",
          isGroup: false,
          key: "AFTrS",
          label: "S",
          visible: true
        },
        {
          expanded: true,
          group: "AFC",
          isGroup: false,
          key: "AFCS",
          label: "S",
          visible: true
        },
        {
          expanded: true,
          group: "AFE",
          isGroup: false,
          key: "AFEG",
          label: "GCS",
          visible: true
        },
        {
          expanded: true,
          group: "AFE",
          isGroup: false,
          key: "AFES",
          label: "S",
          visible: true
        },
        {
          expanded: true,
          isGroup: true,
          key: "A",
          label: "A",
          visible: true,
        }
      ],
      linkDataArray: [
        {
          color: "#FF0000",
          from: "AFAS",
          key: "1",
          label: "HTTPS",
          labelColor: "#FF6666",
          to: "AFCS",
          visible: true
        },
        {
          from: "AFAS",
          highlightColorPrimary: "#FF0000",
          highlightColorSecondary: "#FF6666",
          key: "2",
          label: "",
          to: "AFES",
          visible: true
        },
        {
          from: "AFA",
          key: "3",
          label: "",
          to: "AFT",
          visible: true,
        }
      ]
    };
  }

  visibilityChange = (nodeId: any) =>  {
    let nodeDataArrayx = JSON.parse(JSON.stringify(this.state.nodeDataArray))
    nodeDataArrayx.forEach((node) =>{
      if (node.key == nodeId) {
        node.visible = !node.visible
      }
    })
    let obj: go.IncrementalData 
    obj = {
      modifiedNodeData: nodeDataArrayx
    }
    this.setState({
      nodeDataArray: nodeDataArrayx
    })
  }

  render() {
    return (
      <div>
        <DiagramWrapper
          nodeDataArray={this.state.nodeDataArray}
          linkDataArray={this.state.linkDataArray}
        />
        <RecursiveTreeView
          onVisibilityChange={this.visibilityChange}
          nodeDataArray={this.state.nodeDataArray}
        />
      </div>
    );
  }
}

export default App;
