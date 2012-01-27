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
        
        type_answer: function(e){
            e.stopPropagation();
            
            this.model.set({
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
                question: this.model.toJSON()
            }));

            return this;
        }

    });

    V.AppView = B.View.extend({
        el: '#wrapper',

        initialize: function(){
            Q._debug_info &&
                console.info('View.AppView.initialize', this);
            
            this.render();
        },
        
        go_to: function(direction){
            Q._debug_info &&
                console.info('View.AppView.go_to', this.model);
                  
            var q = this._current_question.model,
                c = this.collection,
                i = c.indexOf( q ),
                next = i + 1,
                prev = i - 1;
            
            if(direction === 'next') {
                q = c.at(next);
                if( q ) {
                    this.model.save({
                        current_question: q.id
                    });
                }
            } else if(direction === 'prev') {
                q = c.at(prev);
                if( q ) {
                    this.model.save({
                        current_question: q.id
                    });
                }
            }
            
            this.render();
        },
        
        render: function(){
            var current_question_id = this.model.get('current_question'),
                current_question = this.collection.get(current_question_id);

            Q._debug_info &&
                 console.info('View.AppView.render', current_question_id);
            
            this._current_question = new V.QuestionView({
                model: current_question
            });
            
            this.$('#questions-inner').html(
                this._current_question.render().el
            );
        }
    });

})();