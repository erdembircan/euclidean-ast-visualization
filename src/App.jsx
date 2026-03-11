import { useState, useCallback } from 'react';
import TreeView from './components/TreeView';
import CodeView from './components/CodeView';
import ExecutionPanel from './components/ExecutionPanel';
import { astTree, codeLines, getDescendantIds } from './data/ast';

export default function App() {
  const [hoverNodes, setHoverNodes] = useState(new Set());
  const [execNodeId, setExecNodeId] = useState(null);

  const handleHover = useCallback((nodeId) => {
    if (nodeId) {
      setHoverNodes(new Set(getDescendantIds(astTree, nodeId)));
    } else {
      setHoverNodes(new Set());
    }
  }, []);

  const handleStepChange = useCallback((step) => {
    setExecNodeId(step ? step.nodeId : null);
  }, []);

  // Execution highlight takes precedence over hover
  const activeNodes = execNodeId
    ? new Set(getDescendantIds(astTree, execNodeId))
    : hoverNodes;

  return (
    <div className="app">
      <h1>Euclidean Algorithm — AST Visualization</h1>
      <TreeView tree={astTree} activeNodes={activeNodes} onHover={handleHover} />
      <div className="bottom-panel">
        <CodeView
          codeLines={codeLines}
          activeNodes={activeNodes}
          onHover={handleHover}
        />
        <ExecutionPanel onStepChange={handleStepChange} />
      </div>
    </div>
  );
}
