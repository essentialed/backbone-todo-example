/**
 * To-do app
 * Features: multiple to-do lists
 */

var console = (function(undefined) {
    var m = ['log', 'error', 'info', 'warn', 'time','timeEnd', 'dir'];
    if(typeof window.console === undefined) {
        var c = {}, f = function() {};
        for (var i=0, l = m.length; i < l; i++) {
            c[m[i]] = f;
        }
        return c;
    }
    return window.console;
})();

var Lists = new Lists();
var Tasks = new Tasks();

Lists.fetch();
Tasks.fetch();

// Only one Lists View
var ListsView = new ListsView({
    collection: Lists
});

// Only one Tasks View
var TasksView = new TasksView({
   collection: Tasks
});


var Router = Backbone.Router.extend({

    routes: {
        "/": "home",
        "/lists/:id": "lists"
    },

    home: function(){
        
        TasksView && TasksView.el.empty();
    },

    lists: function(id) {
        TasksView.render(Lists.get(id));
    }

});

var TodoApp = new Router();
Backbone.history.start();
