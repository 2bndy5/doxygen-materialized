# Tables

[TOC]

## Markdown Tables

Here is an example:

```md
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
```

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

### Column Alignment

Column alignment can be controlled via one or two colons at the header separator line:

```md
| Right | Center | Left  |
| ----: | :----: | :---- |
| 10    | 10     | 10    |
| 1000  | 1000   | 1000  |
```

| Right | Center | Left  |
| ----: | :----: | :---- |
| 10    | 10     | 10    |
| 1000  | 1000   | 1000  |

### Cell Spanning

#### Row Spanning

Additionally, column and row spans are supported. Using a caret ("^") in a cell indicates that the cell above should span rows. Sequences of carets may be used for any number of row spans. For example:

```md
| Right | Center | Left  |
| ----: | :----: | :---- |
| 10    | 10     | 10    |
| ^     | 1000   | 1000  |
```

| Right | Center | Left  |
| ----: | :----: | :---- |
| 10    | 10     | 10    |
| ^     | 1000   | 1000  |

#### Column Spanning

Column spans are supported by means of directly adjacent vertical bars ("|"). Each additional vertical bar indicates an additional column to be spanned. To put it another way, a single vertical bar indicates a single column span, two vertical bars indicates a 2 columns span, and so on. For example:

```md
| Right | Center | Left  |
| ----: | :----: | :---- |
| 10    | 10     | 10    |
| 1000  |||
```

| Right | Center | Left  |
| ----: | :----: | :---- |
| 10    | 10     | 10    |
| 1000  |||

## HTML tables

Here is an example of a complex table using borrowed syntax from HTML:

```html
<table>
<caption id="multi_row">Complex table</caption>
<tr><th>Column 1                      <th>Column 2        <th>Column 3
<tr><td rowspan="2">cell row=1+2,col=1<td>cell row=1,col=2<td>cell row=1,col=3
<tr><td rowspan="2">cell row=2+3,col=2                    <td>cell row=2,col=3
<tr><td>cell row=3,col=1                                  <td rowspan="2">cell row=3+4,col=3
<tr><td colspan="2">cell row=4,col=1+2
<tr><td>cell row=5,col=1              <td colspan="2">cell row=5,col=2+3
<tr><td colspan="2" rowspan="2">cell row=6+7,col=1+2      <td>cell row=6,col=3
<tr>                                                      <td>cell row=7,col=3
<tr><td>cell row=8,col=1              <td>cell row=8,col=2\n
  <table>
    <tr><td>Inner cell row=1,col=1<td>Inner cell row=1,col=2
    <tr><td>Inner cell row=2,col=1<td>Inner cell row=2,col=2
  </table>
  <td>cell row=8,col=3
  <ul>
    <li>Item 1
    <li>Item 2
  </ul>
</table>
```
<!-- markdownlint-disable MD033 -->
<table>
<caption id="multi_row">Complex table</caption>
<tr><th>Column 1                      <th>Column 2        <th>Column 3
<tr><td rowspan="2">cell row=1+2,col=1<td>cell row=1,col=2<td>cell row=1,col=3
<tr><td rowspan="2">cell row=2+3,col=2                    <td>cell row=2,col=3
<tr><td>cell row=3,col=1                                  <td rowspan="2">cell row=3+4,col=3
<tr><td colspan="2">cell row=4,col=1+2
<tr><td>cell row=5,col=1              <td colspan="2">cell row=5,col=2+3
<tr><td colspan="2" rowspan="2">cell row=6+7,col=1+2      <td>cell row=6,col=3
<tr>                                                      <td>cell row=7,col=3
<tr><td>cell row=8,col=1              <td>cell row=8,col=2\n
  <table>
    <tr><td>Inner cell row=1,col=1<td>Inner cell row=1,col=2
    <tr><td>Inner cell row=2,col=1<td>Inner cell row=2,col=2
  </table>
  <td>cell row=8,col=3
  <ul>
    <li>Item 1
    <li>Item 2
  </ul>
</table>
