/*
  ExtJs pub/sub plugin by Jon Sykes (jon@sykes.me)
  
  Loosely based on Dojo's Pub/Sub Topic handlers
  Code lifted _heavily_ from the jquery implementation by Peter Higgins
  https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
  
  Original Discussion: http://www.sencha.com/forum/showthread.php?144261
  
*/
var cache= {};

Ext.define("Ext.topic", {
  singleton: true,
  // the topic/subscription hash
  cache: {},

  publish: function(/* String */topic, /* Array? */args){
    // summary: 
    //    Publish some data on a named topic.
    // topic: String
    //    The channel to publish on
    // args: Array?
    //    The data to publish. Each array item is converted into an ordered
    //    arguments on the subscribed functions. 
    //
    // example:
    //    Add an event listener to a grid that publishes to the 
    //    something/happened topic on select
    //
    //  |   listeners: {
    //  |     'select' : function(grid, rowIndex, e){
    //  |       Ext.topic.publish("something/happened", [rowIndex]);
    //  |     }
    //  |   }
    //
    this.cache[topic] && Ext.each(this.cache[topic], function(){
      //console.debug("Publish fires this function: ", this);
      this.apply(Ext.topic, args || []);
    });
  },

  subscribe: function(/* String */topic, /* Function */callback){
    // summary:
    //    Register a callback on a named topic.
    // topic: String
    //    The channel to subscribe to
    // callback: Function
    //    The handler event. Anytime something is $.publish'ed on a 
    //    subscribed channel, the callback will be called with the
    //    published array as ordered arguments.
    //
    // example:
    //    Add an event listener to a panel that subscribes to the 
    //    something/happened topic and triggers it's handler function
    //  
    // example:
    //  |   listeners:{
    //  |     render: function(){
    //  |       Ext.topic.subscribe("something/happened", this.handleChangeWell);
    //  |     }
    //  |   }
    //
    if(!this.cache[topic]){
      this.cache[topic] = [];
    }
    this.cache[topic].push(callback);
    return [topic, callback]; // Array
  },

  unsubscribe: function(/* Array */handle){
    // summary:
    //    Disconnect a subscribed function for a topic.
    // handle: Array
    //    The return value from a $.subscribe call.
    // example:
    //  |   var handle = Ext.topic.subscribe("something/happened", function(){});
    //  |   Ext.topic.unsubscribe(handle);
    //  |   // best practice would be to put these in an array and on destroy of 
    //  |   // the parent widget loop through and unsubsribe to all the topics.

    var t = handle[0];
    this.cache[t] && Ext.each(this.cache[t], function(idx){
      if(this == handle[1]){
        this.cache[t].splice(idx, 1);
      }
    });
  }
});