Construct 2 Sprite Factory Plugin
==============

This plugin makes object management easier by reducing the number of "if" statements required to spawn various different objects. Using the factory plugin means you can specify the factory object to be spawned and pass the 'Factory' type to the a Sprite 'Spawn another object' method.

1. Installation
------------------

Drag-n-Drop the .c2addon file into the Construct 2 editor and accept the dialog. For more information, visit the [official guide](https://www.scirra.com/manual/158/third-party-addons)

2. Example
------------------

The plugin was created specfically to support the spawning of various different bullet types for a platform shooter. Instead of specifying various "IF" statements to spawn different bullet types. The bullet type is configured on the factory and the factory is passed to be spawned instead. This allows the developer to simply change the object of the factory and it will affect all other calls spawning the factory object.

For more information, go check out the blog post I made on [how it works](http://www.cainsvault.com/blog/construct-2-sprite-factory).