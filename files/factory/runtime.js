// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.SpriteFactory = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    var pluginProto = cr.plugins_.SpriteFactory.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    typeProto.onCreate = function() {}

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type)
    {
        this.type = type;
        this.runtime = type.runtime;
    };

    var instanceProto = pluginProto.Instance.prototype;

    instanceProto.onCreate = function() {}

    // Return the current object associated with this instance
    // of the factory. Returns false if nothing is set.
    instanceProto.get = function()
    {
        if (typeof this.factory !== 'undefined') {
            return this.factory;
        } else {
            return false;
        }
    }

    //////////////////////////////////////
    // Conditions
    function Cnds() {};

    Cnds.prototype.IsParent = function (obj)
    {
        var sol = obj.getCurrentSol();

        for (var key in sol.instances) {

            var instance = sol.instances[key];

            if (typeof instance.from_factory !== 'undefined' && instance.from_factory == this) {

                return true;
            }
        }

        return false;
    }

    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {};

    Acts.prototype.Set = function (obj)
    {
        this.factory = obj;
    }

    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {};

    pluginProto.exps = new Exps();


    // Remember the original spawn function.
    var originalSpawn = cr.plugins_.Sprite.prototype.acts.Spawn;

    /**
     * Extend the Sprite plugin Spawn mechanism to include custom logic for
     * the SpriteFactory plugin. Instead of spawning a new sprite factory, it rather
     * pulls the factory object out of the factory and spawns that.
     */
    cr.plugins_.Sprite.prototype.acts.Spawn = function (obj, layer, imgpt)
    {
        var spawn = [];

        if (obj.plugin instanceof cr.plugins_.SpriteFactory) {

            var sol = obj.getCurrentSol();
            var instances = sol.instances;

            // If no objectd were filtered, then use all objects.
            if (instances.length == 0) {
                instances = sol.type.instances;
            }

            // Pull object out of factory and spawn it for each instance
            // of the factory. If factories are cloned, objects should spawn
            // for the amount of factory instances in existance.
            for (var key in instances) {

                var instance = instances[key];
                var obj = instance.get();

                if (obj) {
                    spawn.push(obj);

                    // Change obj proto for OnCreate to include a call to OnSpawn, then reset
                    // the proto.
                    var originalOnCreate = obj.plugin.Instance.prototype.onCreate;

                    obj.plugin.Instance.prototype.onCreate = function()
                    {
                        // Reset the onCreate
                        obj.plugin.Instance.prototype.onCreate = originalOnCreate;

                        // Mark the object as spawned from this factory.
                        this.from_factory = instance;

                        // Call on create
                        originalOnCreate.apply(this);
                    }
                }
            }

        } else {

            // Spawn one object
            spawn.push(obj);
        }

        // Loop through objects to spawn and push them all out to the Sprite
        // Spawn function.
        for (var key in spawn) {

            // Use the original spawn mechanism
            originalSpawn.apply(this, [spawn[key], layer, imgpt]);
        }
    }
}());