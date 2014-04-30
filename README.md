animate
=======

A quick and dirty animation library

pArgs delineates the potential things which can be animated:

```javascript
pArgs = ['top', 
         'right', 
         'bottom', 
         'left', 
         'height', 
         'width', 
         'margin-top', 
         'margin-right', 
         'margin-left', 
         'margin-bottom', 
         'opacity', 
         'color'];
```

There is also a fade method.

I'm currently working on slideUp, slideDown, and mixed interval mechanics (i.e. parabolic, cubic, bounce, and liquid tension).

## The skinny

```javascript

var Animate = (function() {
  //this library
}());

var a = new Animate(element, callback, stop, interval);

//...

```

| Argument      | Functionality                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| element       | The element you're trying to animate.                                                                  |
| callback      | Some callback to be performed after the animation.                                                     |
| stop          | Boolean. Allows for animation to be executed immediately upon further interatcion with the element.    |
| interval      | String: (default or null, parabolic, cubic, liquid) changed the animation style.                       |

Note: Stop only works for click events at the document level at the moment, in future versions this will be modified slightly.

Note: Interval will be implemented in later updates, for now, it will always revert to default.

## Animate Something

To animate something you can pick one of three methods:

```javascript

a.fadeIn(timer, iterations, inline);
a.fadeOut(timer, iterations);
a.animate(args, timer, iterations);

```

For all of the above, timer is just the execution time of the animation, while iterations defines the number of steps the animation is to be completed in. The default timer is 750ms. The default iteration number is 10.

Note: In the future, I may chose to have a more sophisticated mechanic for defining iterations.

On the fadeIn() method, inline describes whether the end state of the fade should be inline or inline-block. This is a Boolean.

On the animate method, several combinations for args are possible:

```javascript

var args = {
  left: {
    plus: 400
  }
};

var args = {
  left: {
    val: 400
  }
};

```

Any of the arguments in pArgs (defined above) can be passed to this method. In the example above, we see the two possible combinations for defining left: plus, and val. Plus adds the defined amount on to the defined animation element, while val sets the value of the left style argument to 400.

It is possible to pass as many arguments into args from pArgs as you so choose.

Note: If you plan on animating top, right, bottom, or left, it is not my responsibility to set the position of the animation element.

That is about the gist of it.

If you have any other questions email me [here](http://www.joegroseclose.com) or comment on the library.

