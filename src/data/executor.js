export function executeAlgorithm(initialA, initialB) {
  const steps = [];
  let a = initialA;
  let b = initialB;

  steps.push({ nodeId: 'program', a, b, desc: 'Start execution' });

  while (b !== 0) {
    steps.push({ nodeId: 'while', a, b, desc: 'Enter while loop' });
    steps.push({ nodeId: 'notEqual', a, b, desc: `b != 0 → ${b} != 0 = true` });
    steps.push({ nodeId: 'branch', a, b, desc: 'Enter branch' });

    const aGreater = a > b;
    steps.push({ nodeId: 'greaterThan', a, b, desc: `a > b → ${a} > ${b} = ${aGreater}` });

    if (aGreater) {
      const result = a - b;
      steps.push({ nodeId: 'sub1', a, b, desc: `a − b → ${a} − ${b} = ${result}` });
      a = result;
      steps.push({ nodeId: 'assign1', a, b, desc: `a := ${result}` });
    } else {
      const result = b - a;
      steps.push({ nodeId: 'sub2', a, b, desc: `b − a → ${b} − ${a} = ${result}` });
      b = result;
      steps.push({ nodeId: 'assign2', a, b, desc: `b := ${result}` });
    }

    if (steps.length > 500) break;
  }

  steps.push({ nodeId: 'while', a, b, desc: 'Check while condition' });
  steps.push({ nodeId: 'notEqual', a, b, desc: `b != 0 → ${b} != 0 = false` });
  steps.push({ nodeId: 'return', a, b, desc: 'Return a' });
  steps.push({ nodeId: 'return-a', a, b, desc: `GCD = ${a}` });

  return steps;
}
