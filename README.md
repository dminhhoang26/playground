## [Github actions](https://github.com/actions)

## My playground
### Some css tips
```css

awesome-class: {
    white-space: pre-wrap;
}
awsome-class1: {
    white-space: pre-line;
}

```
```css
<!-- flex display -->
awesome-class: {
    justify-content: start end center space-between space-around;
    
    align-items: start end center baseline stretch;
    align-self: start end center baseline stretch;
    
    flex-direction: row row-reverse column column-reverse;
    flex-wrap: nowrap wrap wrap-reverse;
    flex-flow: (flex-direction) (flex-wrap);
    
    order: 0;
    align-content: start end center space-between space-around stretch;
}

```
[overflow element trick:](https://stackoverflow.com/questions/12013066/how-to-ignore-parent-elements-overflowhidden-in-css)
```css
# A good way to do it is by setting the overflowing element to position:fixed (which will make it ignore the parent overflow), and then positioning it relative to the parent using this technique:

​.parent {
   position: relative;      
   .fixed-wrapper {
       position: absolute;         
       .fixed {
           position: fixed;
       }
   }
}
# One caveat is that you cannot have any of the top,right,left,bottom properties set on the fixed element (they must all be default 'auto'). If you need to adjust the position slightly, you can do so using positive/negative margins instead.
```

Remove arrow in input type number tailwindcss
```css
/* In your global.css file */
@layer utilities {
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
}

```

Overflow text
```css
.cut-text { 
  text-overflow: ellipsis;
  overflow: hidden; 
  width: 160px; 
  height: 1.2em; 
  white-space: nowrap;
}
```

### Javascript
- stopImmediatePropagation event
- promise can add any value and return this value if not exec
- TipTap headless editor (try to implement in angular)
- Corepack for nodejs
