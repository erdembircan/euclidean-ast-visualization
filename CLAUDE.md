# Euclidean AST Visualization

## Project Overview

Single-page React (Vite) app that visualizes the Abstract Syntax Tree (AST) of the Euclidean algorithm. Tree on top, pseudocode on bottom, with bidirectional hover highlighting.

## Reference

- Wikipedia AST diagram: https://en.wikipedia.org/wiki/Abstract_syntax_tree#/media/File:Abstract_syntax_tree_for_Euclidean_algorithm.svg

## AST Node Types (matching Wikipedia SVG)

- **structure** (blue `#c9e7ff`): statement sequence, while, return, compare, branch, assign, bin op
- **variable** (green `#98ff9c`): variable nodes with `name: a`, `name: b`
- **constant** (yellow `#fffec9`): constant node with `value: 0`

## Edge Labels

- while → compare: "condition"
- while → branch: "body"
- branch → compare: "condition"
- branch → assign (left): "if-body"
- branch → assign (right): "else-body"

## Pseudocode

```
while b != 0:
    if a > b:
        a := a - b
    else:
        b := b - a
return a
```
