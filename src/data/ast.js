export const astTree = {
  id: 'program',
  label: 'statement',
  sublabel: 'sequence',
  type: 'structure',
  children: [
    {
      id: 'while',
      label: 'while',
      type: 'structure',
      children: [
        {
          id: 'notEqual',
          label: 'compare',
          sublabel: 'op: !=',
          type: 'structure',
          edgeLabel: 'condition',
          children: [
            { id: 'while-b', label: 'variable', sublabel: 'name: b', type: 'variable', children: [] },
            { id: 'while-0', label: 'constant', sublabel: 'value: 0', type: 'constant', children: [] },
          ],
        },
        {
          id: 'branch',
          label: 'branch',
          type: 'structure',
          edgeLabel: 'body',
          children: [
            {
              id: 'greaterThan',
              label: 'compare',
              sublabel: 'op: >',
              type: 'structure',
              edgeLabel: 'condition',
              children: [
                { id: 'if-a', label: 'variable', sublabel: 'name: a', type: 'variable', children: [] },
                { id: 'if-b', label: 'variable', sublabel: 'name: b', type: 'variable', children: [] },
              ],
            },
            {
              id: 'assign1',
              label: 'assign',
              type: 'structure',
              edgeLabel: 'if-body',
              children: [
                { id: 'assign1-a', label: 'variable', sublabel: 'name: a', type: 'variable', children: [] },
                {
                  id: 'sub1',
                  label: 'bin op',
                  sublabel: 'op: −',
                  type: 'structure',
                  children: [
                    { id: 'sub1-a', label: 'variable', sublabel: 'name: a', type: 'variable', children: [] },
                    { id: 'sub1-b', label: 'variable', sublabel: 'name: b', type: 'variable', children: [] },
                  ],
                },
              ],
            },
            {
              id: 'assign2',
              label: 'assign',
              type: 'structure',
              edgeLabel: 'else-body',
              children: [
                { id: 'assign2-b', label: 'variable', sublabel: 'name: b', type: 'variable', children: [] },
                {
                  id: 'sub2',
                  label: 'bin op',
                  sublabel: 'op: −',
                  type: 'structure',
                  children: [
                    { id: 'sub2-b', label: 'variable', sublabel: 'name: b', type: 'variable', children: [] },
                    { id: 'sub2-a', label: 'variable', sublabel: 'name: a', type: 'variable', children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'return',
      label: 'return',
      type: 'structure',
      children: [
        { id: 'return-a', label: 'variable', sublabel: 'name: a', type: 'variable', children: [] },
      ],
    },
  ],
};

export const codeLines = [
  {
    segments: [
      { text: 'while', nodeId: 'while', type: 'keyword' },
      { text: ' ' },
      { text: 'b', nodeId: 'while-b', type: 'variable' },
      { text: ' ' },
      { text: '!=', nodeId: 'notEqual', type: 'operator' },
      { text: ' ' },
      { text: '0', nodeId: 'while-0', type: 'literal' },
      { text: ':', nodeId: 'while', type: 'punctuation' },
    ],
  },
  {
    segments: [
      { text: '    ' },
      { text: 'if', nodeId: 'branch', type: 'keyword' },
      { text: ' ' },
      { text: 'a', nodeId: 'if-a', type: 'variable' },
      { text: ' ' },
      { text: '>', nodeId: 'greaterThan', type: 'operator' },
      { text: ' ' },
      { text: 'b', nodeId: 'if-b', type: 'variable' },
      { text: ':', nodeId: 'branch', type: 'punctuation' },
    ],
  },
  {
    segments: [
      { text: '        ' },
      { text: 'a', nodeId: 'assign1-a', type: 'variable' },
      { text: ' ' },
      { text: ':=', nodeId: 'assign1', type: 'operator' },
      { text: ' ' },
      { text: 'a', nodeId: 'sub1-a', type: 'variable' },
      { text: ' ' },
      { text: '−', nodeId: 'sub1', type: 'operator' },
      { text: ' ' },
      { text: 'b', nodeId: 'sub1-b', type: 'variable' },
    ],
  },
  {
    segments: [
      { text: '    ' },
      { text: 'else', nodeId: 'branch', type: 'keyword' },
      { text: ':', nodeId: 'branch', type: 'punctuation' },
    ],
  },
  {
    segments: [
      { text: '        ' },
      { text: 'b', nodeId: 'assign2-b', type: 'variable' },
      { text: ' ' },
      { text: ':=', nodeId: 'assign2', type: 'operator' },
      { text: ' ' },
      { text: 'b', nodeId: 'sub2-b', type: 'variable' },
      { text: ' ' },
      { text: '−', nodeId: 'sub2', type: 'operator' },
      { text: ' ' },
      { text: 'a', nodeId: 'sub2-a', type: 'variable' },
    ],
  },
  {
    segments: [
      { text: 'return', nodeId: 'return', type: 'keyword' },
      { text: ' ' },
      { text: 'a', nodeId: 'return-a', type: 'variable' },
    ],
  },
];

export function getDescendantIds(tree, targetId) {
  function findNode(node) {
    if (node.id === targetId) return node;
    for (const child of node.children || []) {
      const found = findNode(child);
      if (found) return found;
    }
    return null;
  }

  function collectIds(node) {
    const ids = [node.id];
    for (const child of node.children || []) {
      ids.push(...collectIds(child));
    }
    return ids;
  }

  const node = findNode(tree);
  return node ? collectIds(node) : [];
}
