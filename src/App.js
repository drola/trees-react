import React, { Component } from 'react';
import './App.css';


class TreeNode {
    left;
    right;
    index;
    parent;

    constructor(index, left, right) {
        this.index  = index;
        this.left = left !== undefined ? left : null;
        this.right = right !== undefined ? right : null;

        if(this.left) {
            this.left.parent = this;
        }
        if(this.right) {
            this.right.parent = this;
        }
    }
}

class Tree {
    root;

    constructor(root) {
        this.root = root !== undefined ? root : null;
        if(this.root) {
            this.root.parent = null;
        }
    }

    dfs() {
        let list = [];
        let maxLevel = 0;
        this.forEach((node, level, stack) => {
            maxLevel = Math.max(level, maxLevel);
            let x = 0.0;
            for(let i = 1; i < stack.length; i++) {
                if (stack[i-1].left == stack[i]) {
                    x -= 1/Math.pow(2, i);
                } else {
                    x += 1/Math.pow(2, i);
                }
            }
            list.push({
                node :node,
                level: level,
                x: x,
                index: node.index
            });
        });

        list = list.map(function(a) { a.x = a.x * Math.pow(2, maxLevel); return a});
        let listByIndex = {};
        list.forEach(function (treeNode_) {
            listByIndex[treeNode_.node.index] = treeNode_;
        });
        let connections = [];
        list.forEach(function (treeNode_) {
            if (treeNode_.node.left !== null) {
                connections.push([treeNode_, listByIndex[treeNode_.node.left.index]]);
            }
            if (treeNode_.node.right !== null) {
                connections.push([treeNode_, listByIndex[treeNode_.node.right.index]]);
            }
        });
        list = list.map(function(o) { delete o.node; return o;});

        return [list, connections];
    }

    snapshot(exitingSnapshots) {
        if(!exitingSnapshots) {
            exitingSnapshots = [];
        }
        exitingSnapshots.push(this.dfs());
    }

    forEach(callback) {
        let node = this.root;
        let stack = [];
        while(node !== null) {
            stack.push(node);
            callback(node, stack.length - 1, stack);

            if (node.left !== null) {
                node = node.left;
                continue;
            }

            while(stack.length >= 2 && (stack[stack.length - 2].right === null || stack[stack.length - 2].right === stack[stack.length - 1])) {
                stack.pop();
            }
            stack.pop();
            if (stack.length >= 1 && stack[stack.length - 1].right !== null) {
                node = stack[stack.length - 1].right;
            } else {
                node = null;
            }
        }
    }

    /**
     * Returns new tree with the same structure but with possibly different data on each node
     *
     * @param callback
     */
    map(callback) {

    }



}




class TreeNodeView extends Component {
    render() {
        return (
            <g className={'tree-node ' + (this.props.active ? 'tree-node-active ' : '') + (this.props.color === 'red' ? 'tree-node-red ' : '') + (this.props.color === 'black' ? 'tree-node-black ' : '')}
             transform={'translate(' + this.props.x + ',' + this.props.y + ')'}>
                <circle r="30" cx="0" cy="0"/>
                <text x="0" y="0">{this.props.index}</text>
            </g>
        );
    }
}

class TreeView extends  Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let clll = new TreeNode(2.1);
        let cll = new TreeNode(2, clll);
        let clr = new TreeNode(3);
        let cl = new TreeNode(1, cll, clr);
        let crl = new TreeNode(5);
        let crrr = new TreeNode(6.1);
        let crr = new TreeNode(6, crrr);
        let cr = new TreeNode(4, crl, crr);
        let r = new TreeNode(0, cl, cr);
        let t = new Tree(r);
        this.setState({'tree': t});

        t.forEach(console.log);
    }

    render() {
        let [list, connections] = this.state.tree ? this.state.tree.dfs() : [[], []];
        return (
            <g transform="translate(640, 40)">
                {
                    connections.map(function (connection) { return (
                        <line className="tree-connection" x1={connection[0].x*60} y1={connection[0].level*80} x2={connection[1].x*60} y2={connection[1].level*80} />
                    )
                    }).concat(list.map(function(tn) { return (
                        <TreeNodeView index={tn.index} x={tn.x*60} y={tn.level*80}/>
                    )}))
                }
            </g>
        );
    }
}

TreeNodeView.propTypes = {
    color: React.PropTypes.oneOf(['red', 'black']),
    index: React.PropTypes.number.isRequired,
    active: React.PropTypes.bool,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired
};

class App extends Component {
  render() {
    return (
      <div className="container">
          <h1>Trees</h1>
          <svg width="1280" height="700">
              <TreeView/>
          </svg>
      </div>
    );
  }
}

export default App;
