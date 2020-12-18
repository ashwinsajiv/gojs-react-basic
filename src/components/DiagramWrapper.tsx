/*
*  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

import './Diagram.css';

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<DiagramProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;

  /** @internal */
  constructor(props: DiagramProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  public updateDiagram() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    diagram.startTransaction();
    diagram.updateAllRelationshipsFromData();
    diagram.updateAllTargetBindings();
    diagram.commitTransaction("update");
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, { // !start-diagram
        "undoManager.isEnabled": true, // must be set to allow for model change listening
        // "undoManager.maxHistoryLength": 0,  // comment to enable undo/redo functionality
        model: $(go.GraphLinksModel, {
            linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }),
        "autoScrollRegion": 0,
        "allowMove": true,
    });
    
    function mouseEnter(e, obj) {
        var shape = obj.findObject("SHAPE");
        shape.stroke = "#6202EE";
    };
    
    function mouseLeave(e, obj) {
      var shape = obj.findObject("SHAPE");
      // Return the Shape's fill and stroke to the defaults
      shape.stroke = null;
    };
    function mouseLeaveStrokeNotNull(e, obj) {
      var shape = obj.findObject("SHAPE");
      // Return the Shape's fill and stroke to the defaults
      shape.stroke = "#DEDEDE";
    };

    // define a simple Node template
    diagram.nodeTemplate = $(
        go.Node,
        "Auto", // the Shape will go around the TextBlock
        {
            mouseEnter: mouseEnter,
            mouseLeave: mouseLeave
        },
        new go.Binding("visible", "visible"),
        $(go.Shape, "Rectangle",
        { fill: "#DEDEDE", name: "SHAPE", height: 96, width: 256, stroke: null },
        new go.Binding("fill", "bgColor"),
        new go.Binding("fill", "isSelected", function(sel, node) {
            if (sel) {
                if (node.part.data.highlightColorSecondary == undefined) {
                    return "#D0CCDA"
                } else {
                    return node.part.data.highlightColorSecondary
                }
            } else {
                if (node.part.data.bgColor == undefined) {
                    return "#DEDEDE"
                } else {
                    return node.part.data.bgColor
                }
            }
          }).ofObject(),
        ),
        $(
            go.TextBlock, 
            { margin: go.Margin.parse("32 0 32 0"), stroke: "black", font: "24px roboto", name: "TEXT" },
            new go.Binding("text", "label")
        ),
    );

    diagram.linkTemplate = $(go.Link,
      { routing: go.Link.AvoidsNodes, corner: 10, curve: go.Link.JumpOver },
      new go.Binding("visible", "visible"),

      $(go.Shape, // link path
          { strokeWidth: 2, stroke: "#666666" },
          new go.Binding("stroke", "color"),
      ),
      $(go.Shape, // arrowhead
          { toArrow: "Standard" },
          { strokeWidth: 2, stroke: "#666666", fill: "#666666" },
          new go.Binding("stroke", "color"),
          new go.Binding("fill", "color"),
      ),
      $(go.TextBlock, // label
          { font: "14px roboto", stroke: "#666666", segmentOffset: new go.Point(0, 5) },
          new go.Binding("text", "label"),
          new go.Binding("stroke", "labelColor"),
      ),
    );


    // define the group template
    diagram.groupTemplate = $(
        go.Group, 
        "Auto",
        { // define the group's internal layout
        isShadowed: true, 
        shadowOffset: new go.Point(0, 0),
        shadowBlur: 10,
        shadowColor: "#DEDEDE"
        }, 
        new go.Binding("isSubGraphExpanded", "expanded"),
        new go.Binding("visible", "visible"),
        $(
            go.Shape, 
            "Rectangle",
            { fill: null, stroke: "#DEDEDE", shadowVisible: true, name: "SHAPE" },
            
        ),
        {
            mouseEnter: mouseEnter,
            mouseLeave: mouseLeaveStrokeNotNull
        },
        $(
            go.Panel, 
            "Vertical",
            { defaultAlignment: go.Spot.Left },
            $(
                go.Panel, 
                "Horizontal",
                { defaultAlignment: go.Spot.Top },
                { stretch: go.GraphObject.Horizontal },
                new go.Binding("background", "isSelected", function(sel, node) {
                    if (sel) {
                        if (node.part.data.highlightColorSecondary == undefined) {
                            return "#D0CCDA"
                        } else {
                            return node.part.data.highlightColorSecondary
                        }
                    } else {
                        if (node.part.data.bgColor == undefined) {
                            return "#DEDEDE"
                        } else {
                            return node.part.data.bgColor
                        }
                    }
                }).ofObject(),
                // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
                $("SubGraphExpanderButton",
                { margin: new go.Margin(7, 0, 0, 12) },
                ),
                $(
                    go.TextBlock,
                    { font: "18px roboto", stroke: "#666666", alignment: go.Spot.Center },
                    new go.Binding("text", "label"),
                    new go.Binding("height", "expanded", function(e) {
                        if (!e) return 25; else return 20
                    }).ofObject(),
                    new go.Binding("width", "isSubGraphExpanded", function(e) {
                        if (!e) return 170; else return 200
                    }).ofObject(),
                    new go.Binding("margin", "isSubGraphExpanded", function(e) {
                        if (!e) return 30; else return go.Margin.parse("7 7 7 10") 
                    }).ofObject(),
                    new go.Binding("font", "isSubGraphExpanded", function(e) {
                        if (!e) return "24px roboto"; else return "18px roboto"
                    }).ofObject(),
                    new go.Binding("stroke", "isSubGraphExpanded", function(e) {
                        if (!e) return "black"; else return "#666666"
                    }).ofObject(),
                ),
            ),
            // create a placeholder to represent the area where the contents of the group are
            $(
                go.Placeholder,
                { padding: 32 }
            )
        )  // end Vertical Panel
    );  // end Group !end-diagram

    return diagram;
  }

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName='diagram-component'
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}
