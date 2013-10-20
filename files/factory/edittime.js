/**
 * The factory plugin serves as an object store. Instead of creating many if statements to spawn
 * different objects on different condition. You can create you spawn method to always spawn the
 * Factory object. The factory object has a certain object/sprite stored and will spawn that object
 * instead of a new Factory instance.
 */
function GetPluginSettings()
{
    return {
        "name":         "Factory",
        "id":           "SpriteFactory",
        "version":      "1.0",
        "description":  "A data store that acts as an object factory.",
        "author":       "Chris Brand",
        "help url":     "http://www.cainsvault.com",
        "category":     "Data & Storage",
        "type":         "object",           // appears in layout
        "rotatable":    false,
        "flags":        0
    };
};

////////////////////////////////////////
// Actions
AddObjectParam("Object", "The object to store in the factory");
AddAction(0, 0, "Set factory object", "General", "Object {0} set on the factory", "Set the object of the factory.", "Set");

ACESDone();

// Property grid properties for this plugin
var property_list = [];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
    return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
    return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");

    // Save the constructor parameters
    this.instance = instance;
    this.type = type;

    // Set the default property values from the property table
    this.properties = {};

    for (var i = 0; i < property_list.length; i++) {
        this.properties[property_list[i].name] = property_list[i].initial_value;
    }
}