var Task = Backbone.Model.extend({
    defaults: {
        'text': '',
        'in_lists': [],
        'done': false
    },
    initialize: function(){
        console.info('Task.init', this.toJSON());

        return this;
    },
    toggle_state: function() {

        this.save({
            done: !this.get('done')
        });

        return this;
    }
});


var List = Backbone.Model.extend({
    defaults: {
        'name': 'Untitled',
        'start_date': null,
        'end_date': null
    },
    initialize: function(){
        console.info('List.init =>', this.get('name'));

        return this;
    },
    get_tasks: function(){
        var list_id = this.id;

        return Tasks.filter(function(task){
            if( _.indexOf( task.get('in_lists'), list_id ) >= 0 ) {
                return task;
            }
        }, this);

    }

});

var Tasks = Backbone.Collection.extend({
    model: Task,
    url: '/tasks',
    localStorage: new Store("tasks"),
    initialize: function(){
        console.info('Tasks.init', this.model);

        this.bind('change', function(task) {
            task.TaskView && task.TaskView.render();

        }).bind('add', function(task) {
            TasksView.add_task(task);
            task.save();
        });

        return this;
    }
});

var Lists = Backbone.Collection.extend({
    model: List,
    localStorage: new Store("lists"),
    url: '/lists',
    initialize: function(){
        console.info('Lists.init', this.model);

        this.bind('change', function(list, options) {
            list.ListView && list.ListView.render();
            TasksView.rename(list);

        }).bind('add', function(list) {
            ListsView.add_list(list);
            list.save();

        }).bind('remove', function(list) {
            _.each(list.get_tasks(), function(task) {
                task.destroy();
            });
        });

        return this;
    }
});
