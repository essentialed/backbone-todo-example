(function() {
    var B = Backbone,
        Q = BackboneQuiz.QuizApp,
        M = Q.Models,
        C = Q.Collections,
        V = Q.Views;

    V.QuestionView = B.View.extend({
        template: _.template($('#tmpl-question').html()),
        events: {
            'click .choice span': 'choose_answer',
            'click .back': 'back',
            'click .next': 'next',
            'click .end': 'end',
            'blur .answer input': 'type_answer'
        },
        
        initialize: function(){
            Q._debug_info &&
                console.info('View.QuestionView.initialize', this);
        },
        back: function(e){
            e.stopPropagation();
            e.preventDefault();
            
            Q.MainView.go_to('prev');            
        },
        next: function(e){
            e.stopPropagation();
            e.preventDefault();
            
            Q.MainView.go_to('next');            
        },
        end: function(e){
            e.stopPropagation();
            e.preventDefault();

            Q.ProgressView.render();
        },
        type_answer: function(e){
            e.stopPropagation();
            
            this.model.save({
                answer: $(e.target).val()
            });
        },
        choose_answer: function(e){
            e.stopPropagation();
            e.preventDefault();
            
            var a = 'active',
                choice = $(e.target).closest('.choice'),
                choice_id = choice.attr('data-choice-id');
            
            Q._debug_info &&
                console.info('View.QuestionView.choose_answer', choice_id);
            
            this.model.save({
                answer: choice_id
            });
            
            choice.addClass(a).siblings('.'+a).removeClass(a);
            
        },
        render: function(){
            Q._debug_info &&
                console.info('View.QuestionView.render', this);
                            
            $(this.el).html( this.template({
                question: this.model.toJSON(),
                model: this.model
            }));

            return this;
        }

    });
    
    V.ProgressView = B.View.extend({
        el: '#main',
        template: _.template( $('#tmpl-progress').html() ),
        events: {
            'click #start': 'start'
        },
        start: function(){
            Q.MainView.start_quiz();
        },
        render: function(){
            var qs = this.collection;
            
            $(this.el).html(
                this.template({
                    progress: {
                        total_questions: qs.length,
                        answered_questions: qs.filter(function(q) {
                            return q.answered();
                        }).length,
                        correct_questions: qs.filter(function(q) {
                            return q.is_correct();
                        }).length
                    }
                })
            );
        }
    });
    
    V.AppView = B.View.extend({
        el: '#main',
        template: _.template($('#tmpl-questions').html()),
        events: {
            'click #start-quiz': 'start_quiz'
        },
        
        initialize: function(){
            Q._debug_info &&
                console.info('View.AppView.initialize', this);
        },
        start_quiz: function(e){
            Q.Router.navigate( this.collection.at(0).url(), true );
        },
        go_to: function(direction){
            var c = this.collection;
            
            Q._debug_info &&
                console.info('View.AppView.go_to', direction);
            
            if(direction === 'next') {
                q = c.next();
                if( q ) {
                    Q.Router.navigate( q.url(), true );
                }
            } else if(direction === 'prev') {
                q = c.prev();
                if( q ) {
                    Q.Router.navigate( q.url(), true );
                } else {
                    Q.Router.navigate('/', true );
                }
            }
            
            return this;
        },
        render: function(id){
            Q._debug_info &&
                 console.info('View.AppView.render', id);
            
            var current_question = this.collection.get(id);
            
            this._current_question = new V.QuestionView({
                model: current_question
            });
            
            this.collection.current_question = current_question;
            
            $(this.el).html(
                this.template()
            ).find('#questions-inner').append(
                this._current_question.render().el
            );
            
            return this;
        }
    });

})();