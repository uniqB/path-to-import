# path-to-import
Tool for replacing src="path" by import statement for React components.

`path-to-import -h`  or  `p2i -h`  for usage

Example:

`p2i --src=./src --ext=js,jsx --prefix=assets` 

Before:

```js
<img src="images/logo@2x.png" alt="" />
```

After:

```js
import logo2xPng from 'assets/images/logo@2x.png';
.
.
.
<img src={logo2xPng} alt="" />
```
