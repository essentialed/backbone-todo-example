/**
 * To-do app
 * Features: multiple to-do lists
 *           to-do lists can have a start & end date
 *           tasks can have comments
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
//(function() {



var Lists = new Lists();
var Tasks = new Tasks();

Lists.fetch();
Tasks.fetch();

// Only one Lists View
var ListsView = new ListsView({
    collection: Lists
});

// Only one Tasks View (this should change)
var TasksView = new TasksView({
   collection: Tasks
});


var Router = Backbone.Router.extend({

    routes: {
        "/": "home",
        "/lists/:id": "lists",
        "/tasks/:id": "tasks"
    },
    
    initialize: function(){

        
    },
    home: function(){
        TasksView && TasksView.el.empty();
    },
    lists: function(id) {
        /*
        
        TasksView && TasksView.remove();
        
        if(!id){return;}
        
        var list = Lists.get(id);
        
        list && TasksView = new TasksView({
           collection: new Tasks(),
           list: new List()
        });
        */
        var list = Lists.get(id);
        TasksView.render(list);
    },

    tasks: function(id) {
        
    }

});
var TodoApp = new Router();
//Backbone.history.start({pushState:true});
Backbone.history.start();


/*
Tasks.add(mytask);

mytask.add_to_list(mylist);

Lists.add(mylist);

ListsView.render();

Lists.add({
    'name': 'more things to do'
});

Lists.add({
    'name': 'gamise ta'
});

mytask.save();
mylist.save();
*/
//})();
