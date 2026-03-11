const TYPE_COLORS = {
  keyword: '#c084fc',
  variable: '#4ade80',
  operator: '#22d3ee',
  literal: '#fb923c',
  punctuation: '#64748b',
};

function getLineGroups(segments, activeNodes) {
  const isDirectActive = segments.map(
    (seg) => seg.nodeId && activeNodes.has(seg.nodeId)
  );

  // Fill in gaps: spaces between two active segments become part of the block
  const inBlock = segments.map((seg, i) => {
    if (isDirectActive[i]) return true;
    if (seg.nodeId) return false;
    // No nodeId (whitespace) — check nearest meaningful neighbors
    let leftActive = false;
    for (let j = i - 1; j >= 0; j--) {
      if (segments[j].nodeId != null) {
        leftActive = isDirectActive[j];
        break;
      }
    }
    let rightActive = false;
    for (let j = i + 1; j < segments.length; j++) {
      if (segments[j].nodeId != null) {
        rightActive = isDirectActive[j];
        break;
      }
    }
    return leftActive && rightActive;
  });

  // Group consecutive in-block segments together
  const groups = [];
  let i = 0;
  while (i < segments.length) {
    if (inBlock[i]) {
      const blockSegs = [];
      while (i < segments.length && inBlock[i]) {
        blockSegs.push(segments[i]);
        i++;
      }
      groups.push({ type: 'block', segments: blockSegs });
    } else {
      groups.push({ type: 'single', segment: segments[i] });
      i++;
    }
  }

  return groups;
}

function SegmentSpan({ seg, isActive, onHover }) {
  const isHoverable = !!seg.nodeId;

  return (
    <span
      className={`code-segment${isHoverable ? ' hoverable' : ''}`}
      style={{
        color: isActive
          ? '#fbbf24'
          : seg.type
            ? TYPE_COLORS[seg.type] || '#e2e8f0'
            : '#e2e8f0',
      }}
      onMouseEnter={isHoverable ? () => onHover(seg.nodeId) : undefined}
      onMouseLeave={isHoverable ? () => onHover(null) : undefined}
    >
      {seg.text}
    </span>
  );
}

export default function CodeView({ codeLines, activeNodes, onHover }) {
  const hasActive = activeNodes.size > 0;

  return (
    <div className="code-container">
      <pre className="code-block">
        <code>
          {codeLines.map((line, lineIdx) => {
            const groups = hasActive
              ? getLineGroups(line.segments, activeNodes)
              : line.segments.map((seg) => ({ type: 'single', segment: seg }));

            return (
              <div key={lineIdx} className="code-line">
                {groups.map((group, gIdx) => {
                  if (group.type === 'block') {
                    return (
                      <span key={gIdx} className="code-highlight-block">
                        {group.segments.map((seg, sIdx) => (
                          <SegmentSpan
                            key={sIdx}
                            seg={seg}
                            isActive={true}
                            onHover={onHover}
                          />
                        ))}
                      </span>
                    );
                  }
                  return (
                    <SegmentSpan
                      key={gIdx}
                      seg={group.segment}
                      isActive={false}
                      onHover={onHover}
                    />
                  );
                })}
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
