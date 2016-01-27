'use strict';
import React, { Component, PropTypes } from 'react'
import "bootstrap"
import Tree from 'react-ui-tree'
import cx from 'classnames'
import "./app.less"

export default class CurrentTree extends Component {

  // The render method call from Tree, this checks what node is to be renderd and calls new function
  renderNode(node) {
    switch (node.type) {
      case 'Root':
        return this.renderRoot(node);
      case 'Sample':
        return this.renderSample(node);
      case 'Method':
        return this.renderMethod(node);
      default:
        console.log('Type not found');
    }
  }

  renderRoot(node){
    return (
      <span className="node node-root">
        <span className="node-name">{node.module}</span>
      </span>
    );

  }

   renderSample(node){
    return (
      <span className="node node-sample" onClick={() => this.props.select(node.queue_id, node.sample_id)}>
        <input type="checkbox" onChange={() => this.props.toggleCheckBox(node.queue_id)} checked={this.props.checked.indexOf(node.queue_id) !== -1} />
        <span className="node-name">{node.module}</span>
        <i className="fa fa-times" onClick={() => this.props.deleteSample(node.queue_id)}></i>
        <i className="fa fa-play"  onClick={() => this.props.run(node.queue_id)}></i>
      </span>
    );
    
  }

   renderMethod(node){
     var methodClass = cx('node node-method',{
      'passive': node.state===0,
      'active': node.state===1,
      'success': node.state===2,
      'error': node.state===3,
      'warning': node.state===4,
    }); 

    return (
      <span className={methodClass} onClick={() => this.props.select(node.queue_id, node.sample_id, node.parent_id, true)}>
        <input type="checkbox" onChange={() => this.props.toggleCheckBox(node.queue_id, node.parent_id)} checked={this.props.checked.indexOf(node.queue_id) !== -1} />
        <span className="node-name">{node.module}</span>
        <i className="fa fa-times" onClick={() => this.props.deleteMethod(node.parent_id, node.queue_id, node.sample_id)}></i>
        { node.module !== "Centring" ? <i className="fa fa-cog" onClick={() => this.props.showForm(node.module.toLowerCase())}></i>: ''}
      </span>
    );
    
  }

  // Checking what queue node is pressed and selecting it
  // Handle when a user is changing the order in the tree
  handleChange(tree) {

  }

  createTree(){
    let sampleData = this.props.sampleInformation[this.props.lookup[this.props.currentNode]];
    let tree = {
      module: 'Sample Queue - Current',
      type: "Root",
      children:  (sampleData ? [ {
          module: 'Vial ' + sampleData.id + " " + sampleData.proteinAcronym,
          queue_id: this.props.currentNode,
          sample_id: sampleData.id,
          type: "Sample",
          children : this.props.queue[this.props.currentNode].map( (method_id) =>{
            let methodData = sampleData.methods[method_id];
            return {
              module: methodData.name,
              sample_id: sampleData.id,
              queue_id: method_id,
              parent_id: this.props.currentNode,
              state: methodData.state,
              type: "Method"
            };
          }) 

      }] : [])
    };
    return tree;
  }

  render() {
   let tree = this.createTree();

    return (
          <Tree
            paddingLeft={20}
            tree={tree}
            onChange={this.handleChange.bind(this)}
            renderNode={this.renderNode.bind(this)}/>
    );
  }

}