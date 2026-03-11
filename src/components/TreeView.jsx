import { useMemo } from 'react';

const UNIT_X = 90;
const UNIT_Y = 90;
const PADDING_X = 55;
const PADDING_Y = 25;
const NODE_HEIGHT = 48;
const CHAR_WIDTH = 7;
const NODE_PADDING_X = 12;

const NODE_STYLES = {
  structure: { fill: '#c9e7ff', stroke: '#6ba3d6', text: '#1a3a5c', subtext: '#3d6d99' },
  variable: { fill: '#98ff9c', stroke: '#5cb85c', text: '#1a5c1a', subtext: '#2d8a2d' },
  constant: { fill: '#fffec9', stroke: '#d4c85c', text: '#5c5c1a', subtext: '#8a8a2d' },
};

const ACTIVE_STYLE = { fill: '#fef3c7', stroke: '#f59e0b', text: '#92400e', subtext: '#b45309' };

function layoutTree(node, depth = 0, state = { nextX: 0 }) {
  const result = { ...node, y: depth };

  if (!node.children || node.children.length === 0) {
    result.x = state.nextX;
    state.nextX += 1;
    result.children = [];
    return result;
  }

  result.children = node.children.map((child) =>
    layoutTree(child, depth + 1, state)
  );

  const first = result.children[0];
  const last = result.children[result.children.length - 1];
  result.x = (first.x + last.x) / 2;

  return result;
}

function getNodeWidth(label, sublabel) {
  const maxLen = Math.max(label.length, (sublabel || '').length);
  return maxLen * CHAR_WIDTH + NODE_PADDING_X * 2;
}

function flattenTree(node, list = []) {
  list.push(node);
  for (const child of node.children || []) {
    flattenTree(child, list);
  }
  return list;
}

function TreeEdges({ node, activeNodes }) {
  if (!node.children || node.children.length === 0) return null;

  const parentX = node.x * UNIT_X + PADDING_X;
  const parentY = node.y * UNIT_Y + PADDING_Y + NODE_HEIGHT;

  return (
    <>
      {node.children.map((child) => {
        const childX = child.x * UNIT_X + PADDING_X;
        const childY = child.y * UNIT_Y + PADDING_Y;
        const midY = (parentY + childY) / 2;
        const isActive = activeNodes.has(node.id) && activeNodes.has(child.id);

        return (
          <g key={child.id}>
            <path
              d={`M ${parentX} ${parentY} C ${parentX} ${midY}, ${childX} ${midY}, ${childX} ${childY}`}
              fill="none"
              stroke={isActive ? '#f59e0b' : '#94a3b8'}
              strokeWidth={isActive ? 2.5 : 1.5}
              style={{ transition: 'stroke 0.15s ease, stroke-width 0.15s ease' }}
            />
            {child.edgeLabel && (
              <EdgeLabel
                x={(parentX + childX) / 2}
                y={midY}
                text={child.edgeLabel}
                isActive={isActive}
              />
            )}
          </g>
        );
      })}
      {node.children.map((child) => (
        <TreeEdges key={child.id} node={child} activeNodes={activeNodes} />
      ))}
    </>
  );
}

function EdgeLabel({ x, y, text, isActive }) {
  const padding = 4;
  const charW = 6;
  const w = text.length * charW + padding * 2;
  const h = 16;

  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={3}
        fill="white"
        stroke={isActive ? '#f59e0b' : '#e2e8f0'}
        strokeWidth={0.5}
        opacity={0.95}
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fill={isActive ? '#b45309' : '#64748b'}
        fontStyle="italic"
        style={{ pointerEvents: 'none' }}
      >
        {text}
      </text>
    </g>
  );
}

export default function TreeView({ tree, activeNodes, onHover }) {
  const layout = useMemo(() => layoutTree(tree), [tree]);
  const allNodes = useMemo(() => flattenTree(layout), [layout]);

  const maxX = Math.max(...allNodes.map((n) => n.x));
  const maxY = Math.max(...allNodes.map((n) => n.y));

  const svgWidth = (maxX + 1) * UNIT_X + PADDING_X * 2;
  const svgHeight = (maxY + 1) * UNIT_Y + PADDING_Y * 2;

  return (
    <div className="tree-container">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <TreeEdges node={layout} activeNodes={activeNodes} />
        {allNodes.map((node) => {
          const cx = node.x * UNIT_X + PADDING_X;
          const cy = node.y * UNIT_Y + PADDING_Y;
          const w = getNodeWidth(node.label, node.sublabel);
          const isActive = activeNodes.has(node.id);
          const style = isActive
            ? ACTIVE_STYLE
            : NODE_STYLES[node.type] || NODE_STYLES.structure;

          return (
            <g
              key={node.id}
              onMouseEnter={() => onHover(node.id)}
              onMouseLeave={() => onHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={cx - w / 2}
                y={cy}
                width={w}
                height={NODE_HEIGHT}
                rx={8}
                ry={8}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{
                  transition: 'fill 0.15s ease, stroke 0.15s ease',
                  filter: isActive
                    ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))'
                    : 'none',
                }}
              />
              {node.sublabel ? (
                <>
                  <text
                    x={cx}
                    y={cy + 19}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={12}
                    fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                    fontWeight={600}
                    fill={style.text}
                    style={{ transition: 'fill 0.15s ease', pointerEvents: 'none' }}
                  >
                    {node.label}
                  </text>
                  <text
                    x={cx}
                    y={cy + 35}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontFamily="'SF Mono', 'Fira Code', monospace"
                    fontWeight={400}
                    fill={style.subtext || style.text}
                    style={{ transition: 'fill 0.15s ease', pointerEvents: 'none' }}
                  >
                    {node.sublabel}
                  </text>
                </>
              ) : (
                <text
                  x={cx}
                  y={cy + NODE_HEIGHT / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={13}
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                  fontWeight={600}
                  fill={style.text}
                  style={{ transition: 'fill 0.15s ease', pointerEvents: 'none' }}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
