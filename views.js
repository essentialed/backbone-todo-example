/*


*/
var TaskView = Backbone.View.extend({
    /* View for a single Task (shown in primary along with other tasks)
     * A new TaskView is created whenever a task *displayed* not created
     */
    template: _.template($('#tmp-Task').html()),
    events: {
        'change .toggle-state': 'toggle_state',
        'click .task-edit': 'edit',
        'click .task-save': 'save',
        'click .task-delete': 'remove'
    },

    initialize: function(){
        console.info('TaskView.init =>', this.model.get('text'));

        // make sure the model has a reference to this view.
        // if the model was already displayed, remove it.
        // not sure if removing previous view is necessary
        // but collect garbage anyway.
        if(this.model.TaskView) {
            this.model.TaskView.remove();
        }

        this.model.TaskView = this;

        return this;
    },

    edit: function(e){
        this.$('.task').addClass('editing');

        this.$('.task-edit-text').text( this.model.get('text') ).focus();

        return this;
    },

    save: function(e){

        var text = this.$('.task-edit-text').val();

        this.model.save({
            'text': text
        });

        this.$('.task').removeClass('editing');

    },

    remove: function(e){
        this.$('.task').removeClass('editing');
        $(this.model.TaskView.el).slideUp(function(){ $(this).remove(); });
        this.model.destroy();
    },

    toggle_state: function(){
        this.model.toggle_state();

        return this;
    },

    render: function(){
        console.info('TaskView.render =>', this.model.get('text'));

        $(this.el).html(this.template({
            task: this.model.toJSON()
        }));

        return this;
    }
});

var ListView = Backbone.View.extend({
    // View for a single List (shown in sidebar)
    template: _.template($('#tmp-List').html()),
    events: {
        'click .list a': 'show'
    },

    initialize: function(){
        console.info('ListView.init', this.model);

        // same as in TaskView keep a reference from the model to the view.
        // the check if a model already has a view assinged should not be
        // necessary as a ListView is initialised only once per list per
        // page load.
        if(this.model.ListView) {
            this.model.ListView.remove();
        }

        this.model.ListView = this;

        return this;
    },

    show: function(e) {
        e.preventDefault();
        e.stopPropagation();

        TodoApp.navigate( this.model.url(), true );

        return this;
    },

    render: function(){
        console.info('ListView.render', this.model);

        $(this.el).html( this.template({
            list: this.model.toJSON()
        }));

        return this;
    }
});

var ListsView = Backbone.View.extend({
    // View for showing all lists in the sidebar
    el: $('#sidebar'),
    template: _.template($('#tmp-Lists').html()),
    events: {
        'keyup .add-list-name': '_add_list'
    },

    initialize: function(){
        console.info('ListsView.init', this.collection);

        this.el = this.el.html( this.template() );
        this.ol = this.el.find('ol');

        this.render();

        return this;
    },

    _add_list: function(e){
        var is_enter = e.keyCode == 13;

        if (!is_enter){ return this; }

        e.stopPropagation();
        e.preventDefault();

        var list_name = this.$(e.target),
            val = list_name.val();

        if(!val){ return this; }

        var list = new List({
            name: val,
            id: new Date().valueOf() + ''
        });

        this.collection.add(list);

        list_name.val('');

        TodoApp.navigate(list.url(), true);

        return this;
    },

    add_list: function(list){
        console.info('ListsView.add_list', list.get('name'));

        $(new ListView({
            model: list
        }).render().el).appendTo( this.ol );

        return this;
    },

    render: function(){
        console.info('ListsView.render', this.collection);

        this.ol.empty();

        this.collection.each(this.add_list, this);

        return this;
    }
});


var TasksView = Backbone.View.extend({
    // View for showing all tasks within a list (in primary)
    el: $('#primary'),
    template: _.template($('#tmp-Tasks').html()),
    events:{
        'keyup .add-task-text': '_add_task',
        'click #tasks-list-edit': 'edit_list',
        'click #tasks-list-delete': 'delete_list',
        'click #tasks-list-save': 'save_list',
        'keyup #tasks-list-rename': 'save_list'
    },

    initialize: function(){
        console.info('TasksView.init', this);

        return this;
    },

    edit_list: function(e){
        e.stopPropagation();
        e.preventDefault();

        this.$('.heading').addClass('editing');
        this.$('#tasks-list-rename').val(
            this.current_list.get('name')
        ).select();

        return this;
    },

    rename: function(list){
        this.$('#tasks-list-name').text( list.get('name') );

        return this;
    },

    save_list: function(e){
        var is_enter = e.keyCode == 13;

        if (e.keyCode && !is_enter){ return this; }

        var val_el = this.$('#tasks-list-rename'),
            val = val_el.val() || 'Untitled';

        val_el.val('');

        this.current_list.save({
            name: val
        });

        this.$('.heading').removeClass('editing');

        e.stopPropagation();
        e.preventDefault();
    },

    delete_list: function(e){
        e.stopPropagation();
        e.preventDefault();

        this.current_list.ListView.remove();

        this.current_list.destroy();

        TodoApp.navigate('/', true);

        return this;
    },

    _add_task: function(e){
        var is_enter = e.keyCode == 13;

        if (!is_enter){ return this; }

        e.stopPropagation();
        e.preventDefault();

        var task_text = this.$(e.target),
            val = task_text.val();

        if(!val){ return this; }

        var task = new Task({
            text: val,
            in_lists: [ this.current_list.id ]
        });

        this.collection.add(task);

        task_text.val('');

        return this;
    },

    add_task: function(task){
        console.info('TasksView.add_task', task.get('text'));

        if( _.indexOf( task.get('in_lists'), this.current_list.id ) == -1 ) {
            return this;
        }

        $(new TaskView({
            model: task
        }).render().el).prependTo( this.ol );

        return this;
    },

    render: function(list){
        var c = 'active',
            list_id = list.id;

        $(list.ListView.el).siblings('.'+c).removeClass(c).end().addClass(c);

        this.current_list = list;

        this.el = this.el.empty().append( this.template({
            list: list.toJSON()
        }));

        this.ol = this.el.find('ol');

        _.each(list.get_tasks(), function(task){
           this.add_task(task);
        }, this);

        return this;

    }
});